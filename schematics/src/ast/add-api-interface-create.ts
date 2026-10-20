import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { existFile, findInterface, findLastNode, findMethod } from './find-ast';
import { addComment, createMethodType } from './create-ast';
import { applyChanges, createChangeAppendEnd, updateFile } from './update-ast';

import { singular } from '../shared/create';

import { createChangeImport } from './add-imports';

/**
 * Opciones para agregar una nueva ruta a un layout específico en el archivo de rutas de Angular.
 */
export interface AddAPIInterfaceCreateOptions  {
  name: string;
}
/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addAPIInterfaceCreate(tree: Tree, context: SchematicContext, filePath: string, options: AddAPIInterfaceCreateOptions): void {
  const { name } = options;
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, filePath, (source) => {
    /**
     * Variables utilizadas para construir la nueva ruta y sus componentes asociados.
     */
    const variableName = strings.dasherize(singular(name));
    const variableType = `${strings.classify(singular(name))}Create`;
    const returnType = `${strings.classify(singular(name))}`;
    const interfaceName = `IAPI${strings.classify(singular(name))}Service`;
    const importName = `@models/api/local/${strings.dasherize(singular(name))}`;
    /**
     * buscar la interfaz y el metodo create
     */
    const interfaceAPISource = findInterface(source, { interfaceName });
    const methodCreateSource = findMethod(interfaceAPISource, { methodName: 'create' });

    if (!interfaceAPISource || methodCreateSource) {
      return;
    }
    
    const interfaceAPINode = findLastNode(interfaceAPISource);
    if (interfaceAPINode) {
      
      const newMethodCreate = createTemplateNewMethodCreate(variableName, variableType, returnType);
      
      const newChangeMethodCreate = createChangeAppendEnd(source, interfaceAPINode, newMethodCreate, { 
        tabs: 1,
        endNewLine: 1
      });
      const newChangeImport = createChangeImport(source, {
        importName,
        namedImports: [variableType]
      });

      updateFile(tree, filePath, applyChanges(source, [newChangeMethodCreate, newChangeImport]));
    }
  });
}

/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewMethodCreate(variableName: string, variableType: string, returnType: string) {
  const method = createMethodType({
    name: 'create',
    parameters: [{ name: variableName, typeName: variableType }],
    type: { name: 'Observable', typeArguments: [returnType] }
  });

  addComment({
    node: method,
    isMultiline: true,
    text: [
      `create ${variableName}`,
      ``,
      `@param {${variableType}} ${variableName}`,
      `@returns Observable<${returnType}>`,
    ]
  })

  return method;
}