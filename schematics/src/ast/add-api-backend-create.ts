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
export interface AddAPIBackendCreateOptions {
  name: string;
  backend?: string;
}
/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addAPIBackendCreate(tree: Tree, context: SchematicContext, filePath: string, options: AddAPIBackendCreateOptions): void {
  const { name, backend = 'laravel' } = options;
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, filePath, (source) => {
    /**
     * Variables utilizadas para construir la nueva ruta y sus componentes asociados.
     */
    const variableName = strings.dasherize(singular(name));
    const variableType = `${strings.classify(singular(name))}`;
    const returnType = `${strings.classify(singular(name))}`;
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
function createTemplateNewMethodCreate(variableName: string, variableType: string, returnType: string) {
  const method = createMethodType({
    name: 'create',
    parameters: [{ name: variableName, typeName: `Local${variableType}Create` }],
    type: { name: 'Observable', typeArguments: [`Local${returnType}`] },
    body: [
      createReturn(
        createCall({
          expression: createPropertyAccess({
            name: 'pipe',
            expression: createCall({
              expression: createPropertyAccessArray(['api', 'post'], { this: true }),
              types: [`${variableType}`],
              arguments: [
                createObject({
                  url: createString(`/${variableName}`, { type: 'template' }),
                  body: createCall({ expression: `nestTo${variableType}Create`, arguments: [variableName] })
                })
              ]
            })
          }),
          arguments: [
            createCall({ expression: 'map', arguments: [`nestTo${variableType}`] })
          ]
        })
      )
    ]
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