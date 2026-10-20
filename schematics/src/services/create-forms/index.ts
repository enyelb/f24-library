import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';

import { CreateOptions, createFolderFeaturesModuleSingular, createNewFiles } from '../../shared/create';

/**
 * forms schematic
 */
export default (options: CreateOptions): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [(t: Tree) => t];
    /**
     * ruta para modulos
     * ejemplo: src/app/features/private/product-create
     */
    const path = createFolderFeaturesModuleSingular(options, '-create');
    /**
     * crear achivos de este modulo
     */
    rules.push(createNewFiles(options, tree, context, path));
    /**
     * ejecutar otros schematic 
     */
    rules.push(schematic('create-api-frontend', { ...options }));
    /**
     * retornar reglas 
     */
    return chain(rules);
  }
}
