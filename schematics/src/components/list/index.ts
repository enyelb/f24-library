import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

import { ListOptions, createFolderFeaturesModule, createNewFiles } from '../../shared/list';

/**
 * schematic para modulo de lista de un recurso
 */
export default (options: ListOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para modulos
     * src/app/features/private/products
     */
    const path = createFolderFeaturesModule(options);
    /**
     * crear achivos de este modulo 
     */
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * ajecutar otros schematic 
     */
    rules.push(schematic('list-table', { ...options }));    
    rules.push(schematic('list-mobile', { ...options }));
    rules.push(schematic('list-routes', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
