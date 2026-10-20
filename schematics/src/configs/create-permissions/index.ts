import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';

import { CreateOptions, createFolderCore, createNewFiles, singular } from '../../shared/create';
import { addPermission } from '../../ast';

/**
 * Create schematic
 */
export default (options: CreateOptions): Rule => {
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
        name: `${singular(options.name)}-create`, 
        scope: options.scope 
      });
    }));
    /**
     * rotornar reglas 
     */
    return chain(rules);
  }
}
