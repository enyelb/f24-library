import { normalize, strings } from '@angular-devkit/core';

import { FileEntry, Rule, SchematicContext, Tree, apply, applyTemplates, chain, forEach, mergeWith, move, url  } from '@angular-devkit/schematics';

/**
 * BaseOptions
 */
export interface BaseOptions {
  name: string;
  path?: string;
  style?: 'scss' | 'css' | 'none';
  prefix?: string;
  scope?: 'private' | 'public';
}

/**
 * Creates the path to the core folder based on the provided options.
 * @param options The options for the list schematic.
 * @param folder The target folder within the core scope.
 * @returns The path to the core folder.
 */
export function createFolderApp(options: BaseOptions, folder: string = ''): string {
  return `${normalize(options.path ?? 'src/app')}${folder}`;
}

/**
 * Creates the path to the core folder based on the provided options.
 * @param options The options for the list schematic.
 * @param folder The target folder within the core scope.
 * @returns The path to the core folder.
 */
export function createFolderCore(options: BaseOptions, folder: string = ''): string {
  return `${createFolderApp(options)}/core${folder}`;
}
/**
 * Creates the path to the shared folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder within the shared scope.
 * @returns The path to the shared folder.
 */
export function createFolderShared(options: BaseOptions, folder: string = ''): string {
  return `${createFolderApp(options)}/shared${folder}`;
}
/**
 * Creates the path to the models folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder within the models scope.
 * @returns The path to the models folder.
 */
export function createFolderModels(options: BaseOptions, folder: string = ''): string {
  return createFolderShared(options, `/models${folder}`);
}
/**
 * Creates the path to the models-api folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder within the models-api scope.
 * @returns The path to the models-api folder.
 */
export function createFolderModelsApi(options: BaseOptions, folder: string = ''): string {
  return createFolderModels(options, `/api${folder}`);
}
/**
 * Creates the path to the feature folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder for the feature.
 * @returns The path to the feature folder.
 */
export function createFolderFeatures(options: BaseOptions, folder: string = ''): string {
  return `${createFolderApp(options)}/features${folder}`;
}
/**
 * Creates the path to the feature module folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder for the feature module.
 * @returns The path to the feature module folder.
 */
export function createFolderFeaturesScope(options: BaseOptions, folder: string = ''): string {
  return createFolderFeatures(options, `/${options.scope}${folder}`);
}
/**
 * Creates the path to the feature folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder for the feature.
 * @returns The path to the feature folder.
 */
export function createFolderFeaturesModule(options: BaseOptions, folder: string = ''): string {
  return createFolderFeaturesScope(options, `/${strings.dasherize(options.name)}${folder}`);
}
/**
 * Creates the path to the feature folder based on the provided options and folder name.
 * @param options The options for the list schematic.
 * @param folder The target folder for the feature.
 * @returns The path to the feature folder.
 */
export function createFolderFeaturesModuleSingular(options: BaseOptions, folder: string = ''): string {
  return createFolderFeaturesScope(options, `/${singular(options.name)}${folder}`);
}
/**
 * Converts a word to its dasherized form
 * @param word The word to be dasherized.
 * @returns The dasherized form of the word.
 */
export function desherize(word?: string): string {
  return strings.dasherize(word ?? '');
}
/**
 * Creates new files for the list schematic based on the provided options and context.
 * @param options The options for the list schematic.
 * @param context The schematic context.
 * @param folder The target folder for the generated files.
 * @returns A rule that applies the template files to the tree.
 */
export function createNewFiles<ExtraOptions extends BaseOptions = BaseOptions>(options: ExtraOptions, tree: Tree, context: SchematicContext, path: string, fileExists?: (path: string) => void): Rule {
  const templateSource = apply(url(`./files/`), [
    applyTemplates({
      ...strings,
      ...options,
      singular: singular(options.name),
      uppercase: (str: string) => str.toUpperCase(),
      lowercase: (str: string) => str.toLowerCase(),
    }),
    move(path),
    forEach((fileEntry: FileEntry) => {
      if (tree.exists(fileEntry.path)) {
        //context.logger.warn(`[WARN] El archivo ${fileEntry.path} ya existe. Omitiendo generación...`);
        if (fileExists) {
          fileExists(fileEntry.path);
        }
        return null;
      }
      return fileEntry;
    })
  ]);
  return chain([mergeWith(templateSource)]);
}
/**
 * 
 * @param tree The schematic tree.
 * @param path The base path to check for the existence of files.
 * @param routes The list of file routes to check within the base path.
 * @returns An array of file paths that exist within the tree.
 */
export function existsFiles(tree: Tree, path: string = '', routes: string[] = []): string[] {
  const pathExists = [];
  for (const route of routes) {
    if (tree.exists(`${path}/${route}`)) {
      pathExists.push(`${path}/${route}`);
    }
  }
  return pathExists;
}

/**
 * 
 * @param tree The schematic tree.
 * @param path The base path to check for the existence of files.
 * @param routes The list of file routes to check within the base path.
 * @returns An array of file paths that exist within the tree.
 */
export function ifFiles(files: string[] = [], fnExists: (file: string) => boolean, fnNotExists: () => boolean) {
  if (files.length > 0) {
    for (const file of files) {
      fnExists(file)
    }
  } else {
    fnNotExists()
  }
}
/**
 * Converts a plural word to its singular form.
 * @param word The plural word to convert..
 * @returns The singular form of the word.
 */
export function singular(word: string): string {
  if (!word) return word;
  // Regla 1: Palabras terminadas en "ies" -> "y" (ej. "categories" -> "category", "entities" -> "entity")
  if (/ies$/i.test(word)) {
    return word.replace(/ies$/i, 'y');
  }
  // Regla 2: Palabras terminadas en "es" tras ch, sh, ss, x, z, o (ej. "status" / "processes")
  // NOTA: "roles" termina en "es", pero su raíz es "role" (quita solo la 's').
  // Por eso "ses", "ches", "shes", "xes", "zes" quitan "es".
  if (/(ches|shes|sses|xes|zes)$/i.test(word)) {
    return word.replace(/es$/i, '');
  }
  // Regla 3: Sustantivos comunes terminados en "s" (ej. "roles" -> "role", "users" -> "user")
  if (/s$/i.test(word) && !/ss$/i.test(word)) {
    return word.replace(/s$/i, '');
  }
  return word;
}