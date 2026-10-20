import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderCore, createNewFiles } from '../../shared/list';
import { addAPIFrontendCreate } from '../../ast/add-api-frontend-create';
import { ModelAPIOptionsUnsafe } from '../../models/api/model';

/**
 * table schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para core
     * ejemplo: src/app/core/services/api/local
     */
    const path = createFolderCore(options, '/services/api/local/');
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path, (path: string) => {
      /**
       * esto se ejecuta solo si el archivo ya existe
       * agregar modulo al archivo de rutas 
       */
      addAPIFrontendCreate(tree, context, path, {
        name: options.name,
      });
    }));
    /**
     * ejecutar otros schematic 
     */
    rules.push(schematic('create-api-interface', { ...options }));
    rules.push(schematic('create-api-backend', { ...options }));


    rules.push(schematic<ModelAPIOptionsUnsafe>('model-api', { ...options, module: 'create', folder: 'local' }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
