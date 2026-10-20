import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { createFolderModelsApi, createNewFiles, desherize } from '../../shared/list';
import { addModelAPI } from '../../ast/add-model-api';
import { ModelAPIOptionsUnsafe, safeOptions } from './model';

/**
 * schematic para modulo de modelos de un lista en el backend
 */
export default (unsafe: ModelAPIOptionsUnsafe): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * nombre del backend
     * ejemplo: laravel, nest, etc
     */
    const options = safeOptions(unsafe);
    const backend = desherize(options.backend);
    const folder = options.folder === 'backend' ? backend : 'local'
    /**
     * ruta para modelos de api 
     * ejemplo: src/app/core/models/api/laravel
     */
    const path = createFolderModelsApi(options, `/${folder}/`);
    rules.push(createNewFiles(options, tree, context, path, (path: string) => {
      /**
       * esto se ejecuta solo si el archivo ya existe
       * agregar modulo al archivo de rutas 
       */
      addModelAPI(tree, context, path, {
        name: options.name,
        backend: options.backend,
        folder: options.folder,
        module: options.module
      });
    }));
    /**
     * ejecutar otros schematic 
     */
    if (folder == 'local') {
      rules.push(schematic('model-api', { ...unsafe, folder: 'backend' }));
    }
    /**
     * retornar reglas 
     */
    return chain(rules);
  }
}
