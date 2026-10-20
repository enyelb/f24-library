import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { existFile, findInterface } from './find-ast';
import { addComment, createFunction, createInterface, createObject, createReturn, createSpreadAssignment } from './create-ast';
import { applyChanges, createChangeAppendEnd, updateFile } from './update-ast';

import { singular } from '../shared/create';

import { createChangeImport } from './add-imports';

import { ModelAPIOptions } from '../models/api/model';

/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addModelAPI(tree: Tree, context: SchematicContext, filePath: string, options: ModelAPIOptions): void {
  const { name, backend = 'laravel', module, folder } = options;
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, filePath, (source) => {
    /**
     * Variables utilizadas para construir la nueva ruta y sus componentes asociados.
     */
    const moduleName = `${strings.dasherize(module)}`;
    const dasherizeName = strings.dasherize(singular(name));
    //const classifyName = `${strings.classify(singular(name))}`;
    const interfaceName = `${strings.classify(singular(name))}${strings.classify(moduleName)}`;
    const importNameLocal = `@models/api/local/${strings.dasherize(singular(name))}`;
    /**
     * buscar la interfaz y el metodo create
     */
    const classModelSource = findInterface(source, { interfaceName });

    if (classModelSource) {
      return;
    }
    
    const changes = [];
    /**
     * 
     */
    const newInterfaceCreate = createTemplateNewInterface(interfaceName);
    changes.push(createChangeAppendEnd(source, source, newInterfaceCreate, { 
      tabs: 0,
      startNewLine: 1,
      endNewLine: 1
    }));

    if (folder === 'backend') {
      const newFunctionCreate = createTemplateNewFunction(dasherizeName, interfaceName, backend);
      changes.push(createChangeAppendEnd(source, source, newFunctionCreate, { 
        tabs: 0,
        startNewLine: 1,
        endNewLine: 1
      }));

      changes.push(createChangeImport(source, {
        importName: importNameLocal,
        namedImports: [{ name: `${interfaceName}`, as: `Local${interfaceName}`}]
      }));
    }

    updateFile(tree, filePath, applyChanges(source, changes));
  });
}
/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewInterface(interfaceName: string) {
  const model = createInterface({
    export: true,
    name: `${interfaceName}`,
  })
  return addComment({
    node: model,
    isMultiline: true,
    text: [`${interfaceName}`]
  });
}
/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewFunction(dasherizeName: string, modelName: string, backend: string) {
  const mapper = createFunction({
    export: true,
    name: `${backend}To${modelName}`,
    type: `${modelName}`,
    parameters: [{name: dasherizeName, typeName: `Local${modelName}`}],
    body: [
      createReturn(
        createObject([
          createSpreadAssignment(dasherizeName)
        ])
      )
    ]
  })
  return addComment({
    node: mapper,
    isMultiline: true,
    text: [`${backend}To${modelName}`]
  });
}