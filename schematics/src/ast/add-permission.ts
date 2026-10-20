import { SchematicContext, Tree } from '@angular-devkit/schematics';

import { existFile, findLastNode, findNodeEndPosition, findVariable, updateFileInsertRight } from './find-ast';

/**
 * Interfaz para las opciones de agregar un permiso tipo módulo.
 */
interface AddPermissionOptions {
  scope?: string;
  name: string;
  permission?: string;
}
/**
 * Agrega un permiso a una subruta existente en el archivo de rutas.
 */
export function addPermission(tree: Tree, context: SchematicContext,  routesFilePath: string, options: AddPermissionOptions) {
  const { scope, name, permission } = options;
  /**
   * Si el scope es 'public', no se agrega el permiso.
   */
  if (scope === 'public') {
    return;
  }
  /**
   * Verifica si el archivo de rutas existe y permite realizar modificaciones sobre él.
   */
  existFile(tree, context, routesFilePath, (source) => {
    /**
     * Genera el nombre y el valor de la variable del módulo basado en el nombre y el permiso proporcionados.
     * Si no se proporciona un permiso, se utiliza el nombre del módulo como valor por defecto.
     */
    const moduleVariableName = `MODULE_${name.toUpperCase().replace(/[\s-]/g, '_')}`;
    const moduleVariableValue = permission ?? `'${moduleVariableName}'`;
    /**
     * Buscar una variable existente con el nombre del módulo en el archivo de rutas.
     */
    const moduleSource = findVariable(source, { variableName: moduleVariableName });
    /**
     * Si la variable del módulo ya existe, se registra un error y se detiene la operación.
     */
    if (moduleSource) {
      context.logger.error(`La variable de módulo ya existe: ${moduleVariableName}`);
      return;
    }
    /**
     * Buscar la última posición de la lista de módulos existentes para insertar el nuevo módulo.
     */
    const modules = findVariable(source, { variableName: 'MODULE_', match: 'start', findAll: true });
    /**
     * Buscar el último nodo de la lista de módulos existentes.
     */
    const moduleLast = findLastNode(modules);
    /**
     * Determinar la posición de inserción para el nuevo módulo.
     */
    const insertPosition = findNodeEndPosition(source, moduleLast);
    /**
     * Insertar el nuevo módulo en la posición determinada.
     */
    updateFileInsertRight(tree, routesFilePath, insertPosition, `\nexport const ${moduleVariableName} = ${moduleVariableValue};`);
  });
}