import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

import { ListOptions, createFolderApp, createFolderCore, createFolderFeaturesModule, createNewFiles } from '../../shared/list';
import { addRouteModule, addPermission } from '../../ast';
//import { existFile, findDynamicImport, findPropertyAssignment, findVariable, printAstTree } from '../../shared/base-ast';


/**
 * List schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para app
     * ejemplo: src/app
     */
    const path = createFolderApp(options);
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path, (path) => {
      /**
       * esto se ejecuta solo si el archivo ya existe
       * agregar modulo al archivo de rutas 
       */
      addRouteModule(tree, context, path, { 
        name: options.name,
        path: options.name,
        scope: options.scope 
      });
    }));
    /**
     * ajecutar otros schematic
     */
    rules.push(schematic('list-permissions', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
