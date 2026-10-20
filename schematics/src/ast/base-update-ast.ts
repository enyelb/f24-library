import { Tree } from '@angular-devkit/schematics';

/**
 * Inserta contenido a la derecha de una posición en un archivo del árbol.
 * @param tree El árbol de archivos de Angular DevKit.
 * @param filePath La ruta del archivo a actualizar.
 * @param position Posición dentro del archivo.
 * @param content Contenido a insertar.
 * @throws Error si el archivo no existe en la ruta indicada.
 */
export function updateFileInsertRight(tree: Tree, filePath: string, position: number, content: string): void {
  if (!tree.exists(filePath)) {
    throw new Error(`El archivo no existe en la ruta: ${filePath}`);
  }

  const fileBuffer = tree.read(filePath);
  if (!fileBuffer) {
    return;
  }

  const recorder = tree.beginUpdate(filePath);
  recorder.insertRight(position, content);
  tree.commitUpdate(recorder);
}

/**
 * Inserta contenido a la izquierda de una posición en un archivo del árbol.
 * @param tree El árbol de archivos de Angular DevKit.
 * @param filePath La ruta del archivo a actualizar.
 * @param position Posición dentro del archivo.
 * @param content Contenido a insertar.
 * @throws Error si el archivo no existe en la ruta indicada.
 */
export function updateFileInsertLeft(tree: Tree, filePath: string, position: number, content: string): void {
  if (!tree.exists(filePath)) {
    throw new Error(`El archivo no existe en la ruta: ${filePath}`);
  }

  const fileBuffer = tree.read(filePath);
  if (!fileBuffer) {
    return;
  }

  const recorder = tree.beginUpdate(filePath);
  recorder.insertLeft(position, content);
  tree.commitUpdate(recorder);
}

/**
 * Inserta contenido a la derecha de una posición en un archivo del árbol.
 * @param tree El árbol de archivos de Angular DevKit.
 * @param filePath La ruta del archivo a actualizar.
 * @param position Posición dentro del archivo.
 * @param content Contenido a insertar.
 * @throws Error si el archivo no existe en la ruta indicada.
 */
export function updateFile(tree: Tree, filePath: string, content: string): void {
  if (!tree.exists(filePath)) {
    throw new Error(`El archivo no existe en la ruta: ${filePath}`);
  }

  tree.overwrite(filePath, content);
}
