import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderFeaturesModule, createNewFiles } from '../../shared/list';

/**
 * Mobile schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para modulos
     * src/app/features/private/products/mobile
     */
    const path = createFolderFeaturesModule(options, '/mobile');
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * ajecutar otros schematic 
     */
    rules.push(schematic('list-actions', { ...options }));
    rules.push(schematic('list-filters', { ...options }));
    rules.push(schematic('list-source', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
