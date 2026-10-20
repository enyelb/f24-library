import { SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

/**
 * types
 */
type TypeParam<T> = T | T[] | undefined;
type TypeAllParam = ts.SourceFile | TypeParam<ts.Node> | TypeParam<ts.ClassDeclaration | ts.ClassExpression> | TypeParam<ts.VariableDeclaration> | TypeParam<ts.FunctionDeclaration> | TypeParam<ts.PropertyDeclaration> | undefined;
type TypeReturn<T> = T | T[] | undefined;
type Options<T extends {}> = { findAll?: boolean; validate?: (node: ts.Node) => boolean, parent?: number} & T;

type ClassOptions = Options<{ className?: string }>;
type InterfaceOptions = Options<{ interfaceName?: string }>;
type VariableOptions = Options<{ variableName?: string, typeFilter?: string, match?: 'start' | 'end' }>;
type FunctionOptions = Options<{ functionName?: string }>;
type MethodOptions = Options<{ methodName?: string }>;
type PropertyOptions = Options<{ propertyName?: string }>;
type PropertyAssignmentOptions = Options<{ propertyName?: string, propertyValue?: string | string[], propertyNotValue?: string | string[] }>;
type PropertyAccessExpressionOptions = Options<{ expressionName?: string }>;
type DynamicImportOptions = Options<{ importPath?: string, exportedMember?: string; }>;

type ImportOptions = Options<{ importName?: string, namedImports?: string | string[], namedNotImports?: string | string[] }>
type NamedImportOptions = Options<{ namedImports?: string | string[] }>

/**
 * Recorre recursivamente el árbol AST y aplica la función visitorFn a cada nodo.
 * @template T El tipo de nodo que se espera encontrar.
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo findAll y validate.
 * @param loads Arreglo donde se almacenan los nodos encontrados (usado internamente para la recursión).
 * @param visitorFn Función que se ejecuta en cada nodo para determinar si es el nodo buscado.
 * @returns El nodo encontrado o un arreglo de nodos encontrados, dependiendo de findAll.
 */
function visitor<T extends ts.Node>(source: TypeAllParam, options: Options<{}> | undefined, loads: T[] = [], visitorFn: (node: ts.Node) => T | undefined): TypeReturn<T> {
  const nodes = Array.isArray(source) ? source : [source];

  for (const n of nodes) {
    if (!n) continue;

    const node = options?.parent ? findParent(n, options.parent) : n;
    
    const result = visitorFn(node);
    const valid = options?.validate ? options.validate(node) : true;

    if (result && valid) {
      loads.push(result);
      // Si solo buscamos el primero y ya lo encontramos, cortamos la búsqueda
      if (!options?.findAll) {
        return loads[0] as TypeReturn<T>;
      }
    }

    // Recorrido recursivo compartiendo la MISMA referencia del arreglo 'loads'
    ts.forEachChild(node, (child) => {
      // Si no es findAll y ya encontramos un elemento en las llamadas recursivas previas, no seguir buscando
      if (!options?.findAll && loads.length > 0) {
        return;
      }
      visitor(child, {...options, parent: undefined }, loads, visitorFn);
    });

    // Si no es findAll y ya se encontró coincidencia en los hijos, retornar inmediatamente
    if (!options?.findAll && loads.length > 0) {
      return loads[0] as TypeReturn<T>;
    }
  }

  // Si findAll es true, devuelve el arreglo completo con todas las coincidencias acumuladas.
  // Si findAll es false y no encontró nada, devuelve undefined.
  return (options?.findAll ? loads : (loads.length > 0 ? loads[0] : undefined)) as TypeReturn<T>;
}

/**
 * 
 */
export function findReduce<T extends ts.Node, R>(source: T | T[], reducerFn: (node: T, currentValue: R) => R, initialValue: R): R {
  const nodes = Array.isArray(source) ? source : [source];
  let currentValue = initialValue;
  for (const n of nodes) {
    if (!n) continue;

    currentValue = reducerFn(n, currentValue);
  }

  return currentValue;
}
/**
 * Busca recursivamente el nodo padre a un nivel específico en la jerarquía de nodos AST.
 * @param source El nodo desde el cual se comenzará a buscar el padre.
 * @param level El número de niveles hacia arriba que se desea buscar en la jerarquía de nodos.
 * @returns El nodo padre encontrado al nivel especificado, o el nodo original si no se encuentra un padre a ese nivel.
 */
export function findParent(source: ts.Node, level: number = 0): ts.Node {
  if (level == 0) {
    return source;
  }

  if (!source.parent) {
    return source;
  }

  return findParent(source.parent, level - 1);
}
/**
 * Busca una declaración o expresión de clase dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la clase y si se deben buscar todas las coincidencias.
 * @returns La ClassDeclaration o ClassExpression encontrada, o undefined.
 */
export function findClass(source: TypeAllParam, options?: ClassOptions): TypeReturn<ts.ClassDeclaration | ts.ClassExpression> {
  const { className } = options || {};
  return visitor<ts.ClassDeclaration | ts.ClassExpression>(source, options, [], (node) => {
    if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      if (!className || node.name?.text === className) {
        return node
      }
    }
  });
}
/**
 * Busca una declaración de interfaz dentro de cualquier nodo AST.
 *
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la interfaz y si se deben buscar todas las coincidencias.
 * @returns La InterfaceDeclaration encontrada, o undefined.
 */
export function findInterface(source: TypeAllParam, options?: InterfaceOptions): TypeReturn<ts.InterfaceDeclaration> {
  const { interfaceName } = options || {};
  return visitor<ts.InterfaceDeclaration>(source, options, [], (node) => {
    if (ts.isInterfaceDeclaration(node)) {
      if (!interfaceName || node.name?.text === interfaceName) {
        return node;
      }
    }
  });
}
/**
 * Busca una declaración de variable dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la variable, el tipo y si se deben buscar todas las coincidencias.
 * @returns La VariableDeclaration encontrada, o undefined.
 */
export function findVariable(source: TypeAllParam, options?: VariableOptions): TypeReturn<ts.VariableDeclaration> {
  const { variableName, typeFilter, match } = options || {};
  
  return visitor<ts.VariableDeclaration>(source, options, [], (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const matchesPattern = match === 'start' && variableName ? 
        node.name.text.startsWith(variableName) : 
        match === 'end' && variableName ? 
          node.name.text.endsWith(variableName) : 
          node.name.text === variableName;

      const matchesName = !variableName || matchesPattern;
      let matchesType = !typeFilter;

      if (typeFilter && node.type) {
        const typeText = node.type.getText().trim();
        if (typeFilter.toLowerCase() === 'array') {
          matchesType =
            ts.isArrayTypeNode(node.type) ||
            (ts.isTypeReferenceNode(node.type) &&
              ts.isIdentifier(node.type.typeName) &&
              node.type.typeName.text === 'Array');
        } else {
          matchesType = typeText === typeFilter;
        }
      }

      if (matchesName && matchesType) {
        return node;
      }
    }
  });
}
/**
 * Busca una declaración de función dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la función y si se deben buscar todas las coincidencias.
 * @returns La FunctionDeclaration encontrada, o undefined.
 */
export function findFunction(source: TypeAllParam, options?: FunctionOptions): TypeReturn<ts.FunctionDeclaration> {
  const { functionName } = options || {};

  return visitor<ts.FunctionDeclaration>(source, options, [], (node) => {
    if (ts.isFunctionDeclaration(node)) {
      if (!functionName || node.name?.text === functionName) {
        return node;
      }
    }
  });
}
/**
 * Busca una declaración de función dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la función y si se deben buscar todas las coincidencias.
 * @returns La FunctionDeclaration encontrada, o undefined.
 */
export function findMethod(source: TypeAllParam, options?: MethodOptions): TypeReturn<ts.MethodDeclaration | ts.MethodSignature> {
  const { methodName } = options || {};

  return visitor<ts.MethodDeclaration | ts.MethodSignature>(source, options, [], (node) => {
    if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) {
      if (!methodName || (ts.isIdentifier(node.name) && node.name.text === methodName)) {
        return node;
      }
    }
  });
}
/**
 * Busca una declaración de propiedad dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la propiedad y si se deben buscar todas las coincidencias.
 * @returns La PropertyDeclaration encontrada, o undefined.
 */
export function findProperty(source: TypeAllParam, options?: PropertyOptions): TypeReturn<ts.PropertyDeclaration> {
  const { propertyName } = options || {};

  return visitor<ts.PropertyDeclaration>(source, options, [], (node) => {
    if (ts.isPropertyDeclaration(node)) {
      if (!propertyName || node.name.getText() === propertyName) {
        return node;
      }
    }
  });
}
/**
 * Busca una asignación de propiedad dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la propiedad, el valor de la propiedad y si se deben buscar todas las coincidencias.
 * @returns La PropertyAssignment encontrada, o undefined.
 */
export function findPropertyAssignment(source: TypeAllParam, options?: PropertyAssignmentOptions): TypeReturn<ts.PropertyAssignment> {
  const { propertyName, propertyValue, propertyNotValue } = options || {};

  return visitor<ts.PropertyAssignment>(source, options, [], (node) => {
    if (ts.isPropertyAssignment(node)) {
      if (!propertyName || (ts.isIdentifier(node.name) && node.name.text === propertyName)) {

        const propertyValueArray = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
        const propertyNotValueArray = Array.isArray(propertyNotValue) ? propertyNotValue : [propertyNotValue];
        const isValue = propertyValue == undefined || (ts.isLiteralExpression(node.initializer) && propertyValueArray.includes(node.initializer.text));
        const isNotValue = propertyNotValue == undefined || (ts.isLiteralExpression(node.initializer) && !propertyNotValueArray.includes(node.initializer.text));

        if (isValue && isNotValue) {
          return node;
        }
      }
    }
  });
} 

/**
 * Busca una asignación de propiedad dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la propiedad, el valor de la propiedad y si se deben buscar todas las coincidencias.
 * @returns La PropertyAssignment encontrada, o undefined.
 */
export function findImport(source: TypeAllParam, options?: ImportOptions): TypeReturn<ts.ImportDeclaration> {
  const { importName, namedImports, namedNotImports } = options || {};

  return visitor<ts.ImportDeclaration>(source, options, [], (node) => {
    if (ts.isImportDeclaration(node)) {
      if (!importName || (ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === importName)) {

        const namedImportsArray = namedImports == undefined ? [] : (Array.isArray(namedImports) ? namedImports : [namedImports]);
        const namedNotImportsArray = namedNotImports == undefined ? [] : (Array.isArray(namedNotImports) ? namedNotImports : [namedNotImports]);
        
        if (!node.importClause?.namedBindings || !ts.isNamedImports(node.importClause.namedBindings)) {
          if (namedImportsArray.length === 0 && namedNotImportsArray.length == 0) {
            return node;
          }
          return;
        }
        
        const isValue = namedImportsArray.length === 0 || node.importClause.namedBindings.elements.some((el) => namedImportsArray.includes(el.propertyName?.text ?? el.name.text));
        const isNotValue = namedNotImportsArray.length === 0 || node.importClause.namedBindings.elements.some((el) => !namedNotImportsArray.includes(el.propertyName?.text ?? el.name.text));
        
        if (isValue && isNotValue) {
          return node;
        }
      }
    }
  });
} 

/**
 * Busca una asignación de propiedad dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la propiedad, el valor de la propiedad y si se deben buscar todas las coincidencias.
 * @returns La PropertyAssignment encontrada, o undefined.
 */
export function findNamedImports(source: TypeAllParam, options?: NamedImportOptions): TypeReturn<ts.NamedImports> {
  const { namedImports } = options || {};

  return visitor<ts.NamedImports>(source, options, [], (node) => {
    if (ts.isNamedImports(node)) {
      const namedImportsArray = namedImports == undefined ? [] : (Array.isArray(namedImports) ? namedImports : [namedImports]);
      if (namedImportsArray.length === 0 || node.elements.some((el) => namedImportsArray.includes(el.propertyName?.text ?? el.name.text))) {
        return node;
      }
    }
  });
}
/**
 * Busca una llamada de importación dinámica `import(...)` dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, PropertyAssignment, ArrowFunction, etc.)
 * @param options (Opcional) Criterios de búsqueda como `importPath` y `exportedMember`.
 * @returns El nodo ts.CallExpression correspondiente al import dinámico, o undefined.
 */
export function findDynamicImport(
  source: TypeAllParam,
  options?: DynamicImportOptions
): TypeReturn<ts.CallExpression> {
  const { importPath, exportedMember } = options || {};

  return visitor<ts.CallExpression>(source, options, [], (node) => {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const pathArg = node.arguments[0];

      /**
       * Verificar que el argumento sea una cadena de texto (StringLiteral)
       */
      if (pathArg && ts.isStringLiteral(pathArg)) {
        const currentPath = pathArg.text;
        /**
         * Si se especificó importPath y no coincide, ignorar este nodo
         */ 
        if (importPath && currentPath !== importPath) {
          return undefined;
        }
        /**
         * Si se especificó exportedMember, se valida que el nodo padre sea una llamada a .then() con el miembro exportado correspondiente.
         */
        if (exportedMember) {
          /*const parentCall = findPropertyAccessExpression(node.parent, { expressionName: 'then' }) as ts.CallExpression;
          if (!parentCall || !parentCall.parent || !matchesExportedMember(parentCall.parent, exportedMember)) {
            return undefined;
          }*/
        }

        return node;
      }
    }
  });
}

/**
 * Versión usando `visitor` navegando hacia abajo sobre un contenedor superior
 */
export function findPropertyAccessExpression(source: TypeAllParam, options?: PropertyAccessExpressionOptions): TypeReturn<ts.CallExpression> {
  const { expressionName } = options || {};

  return visitor<ts.CallExpression>(source, options, [], (node) => {
    if (ts.isCallExpression(node)) {
      // Verificar si la expresión de la llamada es un .then
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'then') {
        // Verificar si el objeto sobre el cual se llama .then es nuestro source
        if (expressionName && node.expression.name.text !== expressionName) {
          return undefined;
        }
        return node;
      }
    }
  });
}

/**
 * buscar el ultimo nodo
 */
export function findLastNode<T extends ts.Node>(source: TypeParam<T>): T | undefined {

  if (!source) {
    return undefined;
  }
  if (source instanceof Array) {
    return source[source.length - 1] as T;
  } else {
    return source as T;
  }
}

/**
 * Buscar la posición final de un nodo en el archivo fuente.
 * @param source El archivo fuente de TypeScript.
 * @param node El nodo cuyo final se desea encontrar.
 * @returns La posición final del nodo en el archivo fuente, o -1 si no se puede determinar.
 */
export function findNodeEndPosition(source: ts.SourceFile, node: TypeAllParam, characteres?: string[], type: 'up' | 'down' = 'down'): number {
  if (!node && !source) {
    return -1;
  }

  const targetNodeArray = node ?? source;
  const targetNode = targetNodeArray instanceof Array ? targetNodeArray[targetNodeArray.length - 1] : targetNodeArray;
  if (targetNode) {
    let insertPosition = targetNode.getEnd();
    const fileText = source.text;
    if (characteres) {
      if (type === 'down') {
        while (!characteres.includes(fileText[insertPosition + 1]) && insertPosition < fileText.length) {
          insertPosition = insertPosition + 1;
        }
      } else {
        while (!characteres.includes(fileText[insertPosition - 1]) && insertPosition > 0) {
          insertPosition = insertPosition - 1;
        }
      }
    }
    return insertPosition;
  }
  
  return -1;
}
/**
 * Buscar la posición inicial de un nodo en el archivo fuente.
 * @param source El archivo fuente de TypeScript.
 * @param node El nodo cuyo inicio se desea encontrar.
 * @returns La posición inicial del nodo en el archivo fuente, o -1 si no se puede determinar.
 */
export function findNodeStartPosition(source: ts.SourceFile, node: TypeAllParam, characteres?: string[], type: 'up' | 'down' = 'up'): number {
  if (!node && !source) {
    return -1;
  }

  const targetNodeArray = node ?? source;
  const targetNode = targetNodeArray instanceof Array ? targetNodeArray[targetNodeArray.length - 1] : targetNodeArray;
  if (targetNode) {
    let insertPosition = targetNode.getFullStart();
    const fileText = source.text;
    if (characteres) {
      if (type === 'up') {
        while (!characteres.includes(fileText[insertPosition - 1]) && insertPosition > 0) {
          insertPosition = insertPosition - 1;
        }
      } else {
        while (!characteres.includes(fileText[insertPosition + 1]) && insertPosition < fileText.length) {
          insertPosition = insertPosition + 1;
        }
      }
    }
    return insertPosition;
  }
  
  return -1;
} 

/**
 * 
 */
export function hasNewLine(source: ts.SourceFile, position: number, characteres?: string[], type: 'up' | 'down' = 'down'): boolean {
  const fileText = source.text;
  let hasNewLine = false;
  if (type === 'down') {
    
    while (!characteres?.includes(fileText[position + 1]) && position < fileText.length) {
      position = position + 1;
      if (fileText[position] === '\n') {
        hasNewLine = true;
        break;
      }
    }
    return hasNewLine;
  } else {
    while (!characteres?.includes(fileText[position - 1]) && position > 0) {
      position = position - 1;
      if (fileText[position] === '\n') {
        hasNewLine = true;
        break;
      }
    }
    return hasNewLine;
  }
}
/**
 * Inserta contenido a la derecha de una posición. La implementación vive en
 * `base-update-ast.ts` (capa de actualización) y se reexporta aquí por compatibilidad.
 */
export { updateFileInsertRight } from './base-update-ast';
/**
 * Imprime de manera recursiva la estructura del árbol AST comenzando desde el nodo proporcionado.
 * @param node El nodo AST a imprimir.
 * @param indentLevel (Opcional) Nivel de indentación para la visualización jerárquica. Por defecto es 0.
 */
export function printAstTree(source: TypeAllParam, indentLevel: number = 0): void {

  const sf = ts.isSourceFile(source as ts.Node)
      ? (source as ts.SourceFile)
      : (source as ts.Node)?.getSourceFile?.();

  const printTrivia = (node: ts.Node, indent: string) => {
    if (!sf) return;

    const fullStart = node.getFullStart();
    const start = node.getStart(sf);

    // En algunos casos getStart() < getFullStart() (nodos sintéticos),
    // así que protegemos el substring.
    if (start <= fullStart) return;

    const trivia = sf.text.substring(fullStart, start);
    if (trivia.length === 0) return;

    // Lo mostramos escapado para que se vean \n, \t y espacios reales.
    const escaped = JSON.stringify(trivia);
    console.log(`${indent}├─ [Trivia] ${escaped}`);
  };

  const printNode = (node: ts.Node) => {
    const indent = '  '.repeat(indentLevel);
    const kindName = ts.SyntaxKind[node.kind]; // Nombre del tipo de nodo
    
    printTrivia(node, indent);

    const textPreview = node.getText()
      .replace(/\s+/g, ' ')
      .substring(0, 40);

    console.log(`${indent}├─ [${kindName}] "${textPreview}${node.getText().length > 40 ? '...' : ''}"`);

    ts.forEachChild(node, (child) => printAstTree(child, indentLevel + 1));
  };

  if (!source) {
    console.error('Source is undefined or null.');
    return;
  }

  if (source instanceof Array) {
    source.forEach((node) => printNode(node));
  } else {
    printNode(source);
  }
}
/**
 * Verifica si un archivo existe y permite ejecutar una función con su SourceFile.
 * 
 * @param tree El árbol de archivos del proyecto.
 * @param context El contexto del esquema.
 * @param filePath La ruta del archivo a verificar.
 * @param fn Función a ejecutar con el SourceFile si el archivo existe.
 * @returns void.
 */
export function existFile(tree: Tree, context: SchematicContext, filePath: string, fn: (source: ts.SourceFile) => void) {
  /**
   * Verifica si el archivo existe antes de continuar.
   */
  if (!tree.exists(filePath)) {
    context.logger.error(`El archivo no existe en la ruta: ${filePath}`);
    return;
  }
  /**
   * Leer el contenido del archivo y crear un SourceFile de TypeScript.
   */
  const buffer = tree.read(filePath);
  if (!buffer) {
    context.logger.error(`No se pudo leer el contenido del archivo en la ruta1: ${filePath}`);
    return;
  };
  /**
   * Crear un SourceFile de TypeScript a partir del contenido del archivo.
   */
  const source = ts.createSourceFile(filePath, buffer.toString('utf-8'), ts.ScriptTarget.Latest, true);
  if (fn) {
    fn(source);
  }
}





/**
 * Busca una asignación de propiedad dentro de cualquier nodo AST.
 * 
 * @param source El nodo raíz donde buscar (SourceFile, ModuleBlock, Block, etc.)
 * @param options Opciones de búsqueda, incluyendo el nombre de la propiedad, el valor de la propiedad y si se deben buscar todas las coincidencias.
 * @returns La PropertyAssignment encontrada, o undefined.
 */
export function findNamedImportsText(source: TypeParam<ts.NamedImports | ts.ImportDeclaration>, options?: NamedImportOptions): Array<string | { name: string, as: string}> {
  const namedImportsSource = findNamedImports(source, options);
  if (namedImportsSource) {
    return findReduce(namedImportsSource, (node, values: Array<string | { name: string, as: string }>) => [
      ...values, 
      ...(node.elements.map(el =>  el.propertyName ? { name: el.propertyName.text, as: el.name.text } : el.name.text) ?? [])
    ], [])
  }
  return [];
} 