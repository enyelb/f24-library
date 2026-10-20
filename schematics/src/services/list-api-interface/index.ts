import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderCore, createNewFiles } from '../../shared/list';
import { ModelAPIOptionsUnsafe } from '../../models/api/model';

/**
 * table schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para core
     * ejemplo: src/app/core/services/api/local/interface
     */
    const path = createFolderCore(options, '/services/api/local/interface/');
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * ejecutar otros schematic 
     */
    rules.push(schematic<ModelAPIOptionsUnsafe>('model-api', { ...options, module: 'list', folder: 'local' }));
    /**
     * retornar reglas 
     */
    return chain(rules);
  }
}
