import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderCore, createNewFiles, desherize } from '../../shared/list';
import { addAPIBackendCreate } from '../../ast/add-api-backend-create';
import { ModelAPIOptionsUnsafe } from '../../models/api/model';

/**
 * table schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * nombre del backend ejemplo: laravel, nest, etc
     */
    const backend = desherize(options.backend);
    /**
     * ruta para core
     * ejemplo: src/app/core/services/api/laravel
     */
    const path = createFolderCore(options, `/services/api/${backend}/`);
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path, (path: string) => {
      /**
       * esto se ejecuta solo si el archivo ya existe
       * agregar modulo al archivo de rutas 
       */
      addAPIBackendCreate(tree, context, path, {
        name: options.name,
        backend: options.backend
      });
    }));
    /**
     * ejecutar otros schematic 
     */
    rules.push(schematic('create-api-interface', { ...options }));

    rules.push(schematic<ModelAPIOptionsUnsafe>('model-api', { ...options, module: 'create', folder: 'backend' }));
    /**
     * retornar reglas 
     */
    return chain(rules);
  }
}
