import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderCore, createNewFiles, desherize } from '../../shared/list';
import { ModelAPIOptions, ModelAPIOptionsUnsafe } from '../../models/api/model';

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
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * ejecutar otros schematic 
     */
    rules.push(schematic('list-api-interface', { ...options }));
    rules.push(schematic<ModelAPIOptionsUnsafe>('model-api', { ...options, module: 'list', folder: 'backend' }));
    /**
     * retornar reglas 
     */
    return chain(rules);
  }
}
