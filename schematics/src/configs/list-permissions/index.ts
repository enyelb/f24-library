import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

import { ListOptions, createFolderCore, createFolderFeaturesModule, createNewFiles } from '../../shared/list';
import { addRouteModule, addPermission } from '../../ast';
//import { existFile, findDynamicImport, findPropertyAssignment, findVariable, printAstTree } from '../../shared/base-ast';


/**
 * List schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para core 
     * ejemplo: src/app/core/config
     */
    const path = createFolderCore(options, '/config');
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path, (path) => {
      /**
       * esto se ejecuta solo si el archivo ya existe
       * agregar permiso al archivo de permisos 
       */
      addPermission(tree, context, path, { 
        name: options.name, 
        scope: options.scope 
      });
    }));
    /**
     * rotornar reglas 
     */
    return chain(rules);
  }
}
