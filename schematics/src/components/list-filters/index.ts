import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderFeaturesModule, createNewFiles } from '../../shared/list';

/**
 * filters schematic
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para modulos
     * src/app/features/private/products/filters
     */
    const path = createFolderFeaturesModule(options, '/filters');
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
