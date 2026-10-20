import { SchematicContext, Tree } from '@angular-devkit/schematics';

import { existFile, findImport, findLastNode, findNamedImportsText } from './find-ast';
import { createImport } from './create-ast';
import { updateFile, applyChanges, createChangeReplace } from './update-ast'
import ts from 'typescript';


/**
 * Opciones para agregar una nueva ruta a un layout específico en el archivo de rutas de Angular.
 */
export interface AddImportsOptions  {
  importName: string;
  namedImports?: Array<string | { name: string, as: string }>;
}
/**
 * 
 * @param tree El árbol de archivos de Angular DevKit
 * @param routesFilePath La ruta al archivo de rutas donde se agregará la nueva ruta
 * @param options Opciones que definen el nombre, el scope y el permiso de la nueva ruta
 * @returns void
 */
export function addImports(tree: Tree, context: SchematicContext, filePath: string, options: AddImportsOptions): void {
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, filePath, (source) => {
    const newChange = createChangeImport(source, options);
    if (newChange) {
      updateFile(tree, filePath, applyChanges(source, [newChange]));
    } else {
      // implementar mas adelante
    }
  });
}

/**
 * 
 * @param importName 
 * @param namedImports 
 * @returns 
 */
export function createChangeImport(source: ts.SourceFile, options: AddImportsOptions) {
  const { importName, namedImports } = options;
  /**
   * buscar para ver si existe el import
   */
  const importSource = findImport(source, { importName });
  const importNode = findLastNode(importSource);
  if (!importNode) {
    return;
  }
  
  const oldNamedImports = findNamedImportsText(importSource);
  const oldNamedImportsStrings = oldNamedImports.map(importName => typeof importName === 'string' ? importName : importName.name)
  const newNamedImports = (namedImports ?? []).filter(importName => !oldNamedImportsStrings.includes(typeof importName === 'string' ? importName : importName.name));

  const newImport = createTemplateNewImport(importName, [...oldNamedImports, ...newNamedImports]);
  
  return createChangeReplace(source, importNode, newImport);
}

/**
 * Crear plantilla de un nuevo módulo de ruta.
 */
function createTemplateNewImport(importName: string, namedImports?: Array<string | { name: string, as: string }>) {
  return createImport({
    import: importName,
    namedImports: namedImports
  });
}