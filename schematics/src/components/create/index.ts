import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

import { CreateOptions, createFolderFeaturesModuleSingular, createNewFiles } from '../../shared/create';

/**
 * schematic para modulo de creacion de un recurso
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
     * ajecutar otros schematic 
     */
    rules.push(schematic('create-forms', { ...options }));  
    rules.push(schematic('create-routes', { ...options }));
    /**
     * retornar reglas
     */
    return chain(rules);
  }
}
