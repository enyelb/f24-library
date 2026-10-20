import * as ts from 'typescript';

import { ImportDeclarationOptions } from './base-options';

/**
 * Crea un nodo de identificador de TypeScript con el nombre proporcionado.
 */
export function createIdentifier(name: string) {
  return ts.factory.createIdentifier(name);
}
/**
 * Crea un nodo de literal de cadena de TypeScript con el valor proporcionado.
 * Usa comillas simples por defecto para coincidir con el estilo del proyecto (.editorconfig).
 */
export function createStringLiteral(name: string, isSingleQuote: boolean = true) {
  return ts.factory.createStringLiteral(name, isSingleQuote);
}
/**
 * 
 */
export function createNoSubstitutionTemplateLiteral(name: string, rawText?: string) {
  return ts.factory.createNoSubstitutionTemplateLiteral(name, rawText);
}
/**
 * Crea un nodo de cadena o identificador de TypeScript según el valor proporcionado y si se debe tratar como identificador o literal de cadena.
 */
type CreateStringKind = 'string' | 'identifier' | 'template';
type CreateStringResult<E, T extends CreateStringKind> =
  [E] extends [string]
    ? T extends 'string'
      ? ts.StringLiteral
      : T extends 'template'
        ? ts.NoSubstitutionTemplateLiteral
        : ts.Identifier
    : E;   
export function createString<E, T extends CreateStringKind = 'identifier'>(
  name: E | string,
  options: { type?: T } = {}
): CreateStringResult<E, T> {
  const { type = 'identifier' as T } = options;

  if (typeof name === 'string') {
    if (type === 'identifier') {
      return createIdentifier(name) as CreateStringResult<E, T>;
    } else if (type === 'string') {
      return createStringLiteral(name) as CreateStringResult<E, T>;
    } else if (type === 'template') {
      return createNoSubstitutionTemplateLiteral(name) as CreateStringResult<E, T>;
    }
  }

  return name as CreateStringResult<E, T>;
}
/**
 * Crea un nodo de expresión de objeto literal de TypeScript a partir de las propiedades proporcionadas.
 */
export function createObjectLiteralExpression(options: {
  properties: ts.ObjectLiteralElementLike[], 
  multiLine?: boolean 
}) {
  return ts.factory.createObjectLiteralExpression(
    options.properties, 
    options.multiLine ?? true
  );
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y una expresión de función flecha.
 */
export function createPropertyAssignment(options: {
  name: string | ts.PropertyName,
  expresion: ts.Expression,
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return ts.factory.createPropertyAssignment(
    createString(options.name, { 
      type: options.typeString 
    }),
    options.expresion
  );
}
/**
 * Crea un nodo de función flecha de TypeScript con los parámetros y la expresión proporcionados.
 */
export function createArrowFunction(options: { 
  modifiers?: ts.Modifier[], 
  typeParameters?: ts.TypeParameterDeclaration[], 
  explicitReturnType?: ts.TypeNode,
  parameters?: ts.ParameterDeclaration[],
  expression: ts.ConciseBody,
}): ts.ArrowFunction {
  return ts.factory.createArrowFunction(
    options.modifiers,
    options.typeParameters,
    options.parameters ?? [],
    options.explicitReturnType,
    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    options.expression
  );
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y un valor de cadena.
 */
export function createCallExpression(options: { 
  expression: ts.Expression, 
  typeArguments?: ts.TypeNode[], 
  argumentsArray?: ts.Expression[] 
}) {
  return ts.factory.createCallExpression(
    options.expression,
    options.typeArguments,
    options.argumentsArray
  );
}
/**
 * Crea un nodo de llamada de función de TypeScript con la expresión, los argumentos y los argumentos de tipo proporcionados.
 */
export function createPropertyAccessExpression(options: { 
  expression: ts.Expression,
  name: ts.MemberName | string
}) {
  return ts.factory.createPropertyAccessExpression(
    options.expression,
    options.name
  );
}
/**
 * Crea un nodo de declaración de parámetro de TypeScript con los modificadores, el nombre, el tipo y el valor predeterminado proporcionados.
 */
export function createParameterDeclaration(options: {
  modifiers?: ts.Modifier[],
  dotDotDotToken?: ts.DotDotDotToken,
  name: string | ts.BindingName,
  questionToken?: ts.QuestionToken,
  type?: ts.TypeNode,
  initializer?: ts.Expression
}) {
  return ts.factory.createParameterDeclaration(
    options.modifiers,
    options.dotDotDotToken,
    options.name,
    options.questionToken,
    options.type,
    options.initializer
  );
}
/**
 * Crea un nodo de declaración de método de TypeScript con los modificadores, el nombre, los parámetros, el tipo y el cuerpo proporcionados.
 */
export function createMethodDeclaration(options: {
  modifiers?: ts.Modifier[],
  asteriskToken?: ts.AsteriskToken,
  name: string | ts.PropertyName,
  questionToken?: ts.QuestionToken,
  typeParameters?: ts.TypeParameterDeclaration[],
  parameters: ts.ParameterDeclaration[],
  type?: ts.TypeNode,
  body?: ts.Block,
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return ts.factory.createMethodDeclaration(
    options.modifiers,
    options.asteriskToken,
    createString(options.name, { 
      type: options.typeString 
    }),
    options.questionToken,
    options.typeParameters,
    options.parameters,
    options.type,
    options.body
  );
}
/**
 * Crea un nodo de firma de método de TypeScript con los modificadores, el nombre, los parámetros y el tipo proporcionados.
 */
export function createMethodSignature(options: {
  modifiers?: ts.Modifier[],
  name: string | ts.PropertyName,
  questionToken?: ts.QuestionToken,
  typeParameters?: ts.TypeParameterDeclaration[],
  parameters: ts.ParameterDeclaration[],
  type?: ts.TypeNode,
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return ts.factory.createMethodSignature(
    options.modifiers,
    createString(options.name, { 
      type: options.typeString 
    }),
    options.questionToken,
    options.typeParameters,
    options.parameters,
    options.type
  );
}
/**
 * Crea un nodo de literal de matriz de TypeScript con los elementos proporcionados.
 */
export function createArrayLiteralExpression(options: {
  elements?: ts.Expression[] | string[],
  multiLine?: boolean,
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return ts.factory.createArrayLiteralExpression(
    options.elements?.map(value => createString(value, { type: options.typeString })) ?? [],
    options.multiLine ?? false
  );
}
/*
 * Crea un nodo de referencia de tipo de TypeScript con el nombre proporcionado.
 */
export function createTypeReferenceNode(options: {
  name: string;
  typeArguments?: ts.TypeNode[];
}) {
  return ts.factory.createTypeReferenceNode(
    options.name, 
    options.typeArguments
  );
}
/**
 * Crea un nodo de especificador de importación de TypeScript con el nombre, el nombre de propiedad y si es solo tipo proporcionados.
 */
export function createImportSpecifier(options: {
  isTypeOnly?: boolean;
  propertyName?: string | ts.ModuleExportName;
  name: string | ts.Identifier;
  typeString?: 'string' | 'identifier' | 'template';
}) {
  return ts.factory.createImportSpecifier(
    options.isTypeOnly ?? false,
    createString(options.propertyName, { 
      type: options.typeString 
    }),
    typeof options.name === 'string' ? createIdentifier(options.name) : options.name
  );
}
/**
 * 
 */
export function createNamedImports(options: {
  elements: ts.ImportSpecifier[]
}) {
  return ts.factory.createNamedImports(
    options.elements
  )
}
/**
 * Crea un 
 */
export function createImportClause(options: {
  phaseModifier?: ts.ImportPhaseModifierSyntaxKind, 
  name?: string | ts.Identifier, 
  namedBindings?: ts.NamedImportBindings
}) {
  return ts.factory.createImportClause(
    options.phaseModifier,
    typeof options.name === 'string' ? createIdentifier(options.name) : options.name,
    options.namedBindings
  ) 
}
/**
 * Crea un nodo de cláusula de importación de TypeScript con los elementos de importación proporcionados.
 */
export function createImportDeclaration(options: {
  modifiers?: ts.ModifierLike[], 
  importClause?: ts.ImportClause, 
  moduleSpecifier: ts.Expression, 
  attributes?: ts.ImportAttributes,
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return ts.factory.createImportDeclaration(
    options.modifiers,
    options.importClause,
    createString(options.moduleSpecifier, { 
      type: options.typeString 
    }),
    options.attributes
  );
}
/**
 * 
 */
export function createBlock(options: {
  statements: ts.Statement[], 
  multiLine?: boolean
}) {
  return ts.factory.createBlock(
    options.statements,
    options.multiLine,
  );
}
/**
 *
 */
export function createReturnStatement(expression?: ts.Expression) {
  return ts.factory.createReturnStatement(expression);
}
/**
 * 
 */
export function createInterfaceDeclaration(options: {
  modifiers?: ts.ModifierLike[], 
  name: string | ts.Identifier, 
  typeParameters?: ts.TypeParameterDeclaration[], 
  heritageClauses?: ts.HeritageClause[], 
  members: ts.TypeElement[]
}) {
  return ts.factory.createInterfaceDeclaration(
    options.modifiers,
    options.name,
    options.typeParameters,
    options.heritageClauses,
    options.members
  );
}
/**
 * 
 */
export function createFunctionDeclaration(options: {
  modifiers?: ts.ModifierLike[], 
  asteriskToken?: ts.AsteriskToken, 
  name?: string | ts.Identifier, 
  typeParameters?: ts.TypeParameterDeclaration[], 
  parameters: ts.ParameterDeclaration[], 
  type?: ts.TypeNode, 
  body?: ts.Block
}) {
  return ts.factory.createFunctionDeclaration(
    options.modifiers,
    options.asteriskToken,
    options.name,
    options.typeParameters,
    options.parameters,
    options.type,
    options.body
  );
}
/**
 * 
 */
export function createSpreadAssignment(expression: ts.Expression | string) {
  return ts.factory.createSpreadAssignment(
    typeof expression === 'string' ? createIdentifier(expression) : expression
  );
}
/**
 *
 */
export function addSyntheticLeadingComment<T extends ts.Node>(options: {
  node: T, 
  kind?: ts.SyntaxKind.MultiLineCommentTrivia | ts.SyntaxKind.SingleLineCommentTrivia,
  text: string, 
  hasTrailingNewLine?: boolean
}) {
  ts.addSyntheticLeadingComment(
    options.node,
    options.kind ?? ts.SyntaxKind.MultiLineCommentTrivia,
    options.text,
    options.hasTrailingNewLine ?? true
  )
}














/**
 * Convierte un nodo AST a string aplicando el nivel de sangría especificado.
 */
export function nodeToString(node: ts.Node, tabs: number = 0): string {
  const tabSize = 2;

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
  });

  const dummySourceFile = ts.createSourceFile('temp.ts', '', ts.ScriptTarget.Latest);
  const rawCodeTabsX4 = printer.printNode(ts.EmitHint.Unspecified, node, dummySourceFile);
  const rawCode = rawCodeTabsX4
    .split('\n')
    .map((line) => {
      return line.replace(/^( +)/, (match) => ' '.repeat(match.length / tabSize));
    })
    .join('\n');

  if (tabs === 0) {
    return rawCode;
  }
  const indentation = ' '.repeat(tabs * tabSize);
  
  return rawCode
    .split('\n')
    .map((line) => (line.trim() ? `${indentation}${line}` : line))
    .join('\n');
}

/**
 * Devuelve un arreglo de nodos de asignación de propiedad si la condición es verdadera, de lo contrario devuelve un arreglo vacío.
 */
export function conditionalExpressions<T extends ts.Node>(condition: boolean, nodes: T[]) {
  return condition ? nodes : [];
}