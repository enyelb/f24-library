import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { existFile, findClass, findLastNode, findMethod } from './find-ast';
import { addComment, createCall, createMethodType, createObject, createPropertyAccess, createPropertyAccessArray, createReturn, createString } from './create-ast';
import { applyChanges, createChangeAppendEnd, updateFile } from './update-ast';

import { singular } from '../shared/create';

import { createChangeImport } from './add-imports';

/**
 * Opciones para agregar una nueva ruta a un layout específico en el archivo de rutas de Angular.
 */
export interface AddServiceAPIOptions {
  name: string;
  path?: string;
  style?: 'scss' | 'css' | 'none';
  prefix?: string;
  module: 'create' | 'update' | 'list'
  folder: 'local' | 'backend'
  backend?: 'laravel' | 'nest';
}
/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addServiceAPI(tree: Tree, context: SchematicContext, filePath: string, options: AddServiceAPIOptions): void {
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
    const classifyName = `${strings.classify(singular(name))}`;
    const interfaceName = `${strings.classify(singular(name))}${strings.classify(moduleName)}`;
    const className = `${strings.classify(singular(name))}Service`;
    const importNameLocal = `@models/api/local/${strings.dasherize(singular(name))}`;
    const importNameBackend = `@models/api/${strings.dasherize(backend)}/${strings.dasherize(singular(name))}`;
    /**
     * buscar la interfaz y el metodo create
     */
    const classAPISource = findClass(source, { className });
    const methodCreateSource = findMethod(classAPISource, { methodName: 'create' });

    if (!classAPISource || methodCreateSource) {
      return;
    }
    
    const classAPINode = findLastNode(classAPISource);
    if (classAPINode) {
      
      const newMethodCreate = createTemplateNewMethodCreate(variableName, variableType, returnType);
      
      const newChangeMethodCreate = createChangeAppendEnd(source, classAPINode, newMethodCreate, { 
        tabs: 1,
        endNewLine: 1
      });
      const newChangeImportLocal = createChangeImport(source, {
        importName: importNameLocal,
        namedImports: [{ name: `${variableType}Create`, as: `Local${variableType}Create`}]
      });
      const newChangeImportBackend = createChangeImport(source, {
        importName: importNameBackend,
        namedImports: [`nestTo${variableType}Create`, `nestTo${variableType}`]
      });

      updateFile(tree, filePath, applyChanges(source, [newChangeMethodCreate, newChangeImportLocal, newChangeImportBackend]));
    }
  });
}
/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewMethod(dasherizeName: string, modelName: string, modelNameModule: string, backend: string) {
  const method = createMethodType({
    name: 'create',
    parameters: [{ name: dasherizeName, typeName: `Local${modelNameModule}` }],
    type: { name: 'Observable', typeArguments: [`Local${modelName}`] },
    body: [
      createReturn(
        createCall({
          expression: createPropertyAccess({
            name: 'pipe',
            expression: createCall({
              expression: createPropertyAccessArray(['api', 'post'], { this: true }),
              types: [`${modelName}`],
              arguments: [
                createObject({
                  url: createString(`${dasherizeName}`, { type: 'template' }),
                  body: createCall({ expression: `${backend}To${modelNameModule}`, arguments: [dasherizeName] })
                })
              ]
            })
          }),
          arguments: [
            createCall({ expression: 'map', arguments: [`${backend}To${modelName}`] })
          ]
        })
      )
    ]
  });

  addComment({
    node: method,
    isMultiline: true,
    text: [
      `create ${dasherizeName}`,
      ``,
      `@param {Local${modelNameModule}} ${dasherizeName}`,
      `@returns Observable<${modelName}>`,
    ]
  })

  return method;
}