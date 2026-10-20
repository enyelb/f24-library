import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

import { CreateOptions, createFolderApp, createNewFiles, singular } from '../../shared/create';
import { addRouteModule } from '../../ast';

/**
 * Create schematic
 */
export default (options: CreateOptions): Rule => {
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
       *  esto se ejecuta solo si el archivo ya existe
       * agregar modulo al archivo de rutas
       */
      addRouteModule(tree, context, path, { 
        name: `${singular(options.name)}-create`,
        path: `${options.name}/create`,
        scope: options.scope 
      });
    }));
    /**
     * ajecutar otros schematic 
     */
    rules.push(schematic('create-permissions', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
