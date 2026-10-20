import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ListOptions, createFolderFeaturesModule, createNewFiles } from '../../shared/list';

/**
 * source schematic
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
     * ejecutar otros schematic 
     */
    rules.push(schematic('list-api-frontend', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
