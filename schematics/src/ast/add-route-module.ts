import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { existFile, findDynamicImport, findLastNode, findNodeEndPosition, findNodeStartPosition, findParent, findPropertyAssignment, findVariable, hasNewLine, updateFileInsertRight } from './find-ast';
import { conditionalExpressions, createArrayLiteralExpression, createObjectLiteralExpression, createPropertyAssignment, createPropertyAssignmentArray, createPropertyAssignmentDinamicImport, createPropertyAssignmentObject, createPropertyAssignmentString, nodeToString } from './create-ast';

/**
 * Opciones para agregar una nueva ruta a un layout específico en el archivo de rutas de Angular.
 */
export interface AddRouteModuleOptions  {
  name: string;
  path: string;
  scope?: 'public' | 'private';
}
/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addRouteModule(tree: Tree, context: SchematicContext, routesFilePath: string, options: AddRouteModuleOptions): void {
  const { name, scope, path } = options;
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, routesFilePath, (source) => {
    /**
     * Variables utilizadas para construir la nueva ruta y sus componentes asociados.
     */
    const featureType = scope ?? 'private';
    const pathName = strings.dasherize(path);
    const componentFolder = strings.dasherize(name);
    const componentName = strings.classify(name);
    const moduleVariableName = `MODULE_${name.toUpperCase().replace(/[\s-]/g, '_')}`;
    const moduleImportPath = `./features/${featureType}/${featureType}`;
    /**
     * Obtener la variable routes del archivo de rutas.
     */
    const routesSource = findVariable(source, { variableName: 'routes' });
    if (!routesSource) {
      return;
    }
    /**
     * Buscar la asignación de propiedad 'loadComponent' dentro de la variable 'routes' y 
     * que tenga la importación dinámica correspondiente al módulo.
     */
    const loadComponentSource = findPropertyAssignment(routesSource, { propertyName: 'loadComponent', validate: (node) => {
      return findDynamicImport(node, { importPath: moduleImportPath }) !== undefined;
    }});
    /**
     * Si el loadComponent no se encuentra, es porque el layout del módulo no está definido.
     * Se procederá a crear un nuevo layout para el módulo y salir de la función.
     */
    if (!loadComponentSource) {

      /**
       * Buscar todos los paths que no esten vacíos y luego se obtiene el último path,
       * si no existe ningún path, no se puede determinar la posición de inserción.
       */
      const pathsSource = findPropertyAssignment(routesSource, { propertyName: 'path', propertyValue: '**' });
      const pathLastSource = findLastNode(pathsSource);
      /**
       * como estoy en el path, necesito encontrar el nodo padre para determinar la posición de inserción
       */
      const insertPosition = pathLastSource ? 
        findNodeStartPosition(source, pathLastSource, ['}', ','], 'up') : 
        findNodeEndPosition(source, routesSource, ['[', '}', ','], 'up');

      const newLine = hasNewLine(source, insertPosition, [']', '{'], 'down') ? '' : '\n';
      const newLayout = createTemplateNewLayout(pathName, featureType, componentFolder, componentName, moduleVariableName);
      /**
       * Insertar el nuevo objeto de ruta en la posición determinada.
       */
      updateFileInsertRight(tree, routesFilePath, insertPosition, `\n${nodeToString(newLayout, 1)},${newLine}`);
      
      return;
    }
    /**
     * Obtener la propiedad 'children' del objeto padre que contiene 'loadComponent'.
     * Esta propiedad contiene las rutas hijas del módulo actual. 
     * si no existe, significa que el módulo no tiene rutas hijas definidas.
     */
    const childrenSource = findPropertyAssignment(loadComponentSource, { propertyName: 'children', parent: 1 });
    if (!childrenSource) {
      return;
    }
    /**
     * Buscar la propiedad 'path' dentro de las rutas hijas.
     * y si existe, evitar agregar una ruta duplicada.
     */
    const pathSource = findPropertyAssignment(childrenSource, { propertyName: 'path', propertyValue: pathName });
    if (pathSource) {
      return;
    }
    /**
     * Buscar todos los paths que no esten vacíos y luego se obtiene el último path,
     * si no existe ningún path, no se puede determinar la posición de inserción.
     */
    const pathsSource = findPropertyAssignment(childrenSource, { propertyName: 'path', propertyValue: '', findAll: true });
    const pathLast = findLastNode(pathsSource);

    if (!pathLast) {
      return;
    }
    /**
     * como estoy en el path, necesito encontrar el nodo padre para determinar la posición de inserción
     */
    const pathParent = findParent(pathLast, 1);
    const insertPosition = findNodeStartPosition(source, pathParent, ['[','}', ','], 'up');

    const newRoute = createTemplateNewRouteModule(pathName, featureType, componentFolder, componentName, moduleVariableName);
    /**
     * Insertar el nuevo objeto de ruta en la posición determinada.
     */
    updateFileInsertRight(tree, routesFilePath, insertPosition, `\n${nodeToString(newRoute, 3)},`);
  });
}

/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewRouteModule(pathName: string, featureType: string, componentFolder: string, componentName: string, moduleVariableName: string) {
  return createObjectLiteralExpression({
    properties: [
      createPropertyAssignmentString('path', pathName),
      createPropertyAssignmentDinamicImport('loadComponent', `./features/${featureType}/${componentFolder}/${componentFolder}`, 'm', componentName),
      ...conditionalExpressions(featureType === 'private', [
        createPropertyAssignmentArray('canActivate', ['permissionsGuard']),
        createPropertyAssignmentObject('data', {
          permissions: createArrayLiteralExpression({ elements: [moduleVariableName] })
        })
      ]),
    ]
  });
}
/**
 * Crear plantilla de las rutas hijas de un módulo de ruta.
 */
function createTemplateNewChildren(pathName: string, featureType: string, componentFolder: string, componentName: string, moduleVariableName: string) {
  return createPropertyAssignment({
    name: 'children', 
    expresion: createArrayLiteralExpression({
      elements: [
        createTemplateNewRouteModule(pathName, featureType, componentFolder, componentName, moduleVariableName)
      ], 
      multiLine: true 
    })
  });
}
/**
 * Crear plantilla de un nuevo módulo de ruta con rutas hijas.
 */
function createTemplateNewLayout(pathName: string, featureType: string, componentFolder: string, componentName: string, moduleVariableName: string) {
  const featureTypeCapitalized = featureType.at(0)?.toUpperCase() + featureType.slice(1);
  return createObjectLiteralExpression({
    properties: [
      createPropertyAssignmentString('path', pathName),
      ...conditionalExpressions(featureType === 'private', [
        createPropertyAssignmentArray('canActivate', ['authGuard'])
      ]),
      createPropertyAssignmentDinamicImport('loadComponent', `./features/${featureType}/${componentFolder}`, 'm', featureTypeCapitalized),
      createTemplateNewChildren(pathName, featureType, componentFolder, componentName, moduleVariableName)
    ]
  });
}