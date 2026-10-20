import * as ts from 'typescript';

import * as base from './base-create-ast';

export * from './base-create-ast';
/**
 * Crea un nodo de llamada de importación dinámica y lo asigna a una propiedad con una función de flecha.
 */
export function createImportCall(importPath: string) {
  return base.createCallExpression({
    expression: ts.factory.createToken(ts.SyntaxKind.ImportKeyword) as any,
    typeArguments: undefined,
    argumentsArray: [ts.factory.createStringLiteral(importPath)]
  });
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y un valor de cadena.
 */
export function createPropertyAssignmentString(name: string, value: string) {
  return base.createPropertyAssignment({
    name: name,
    expresion: ts.factory.createStringLiteral(value)
  });
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y un valor de objeto.
 */
export function createPropertyAssignmentObject(name: string, values: { [key: string]: ts.Expression }) {
  return base.createPropertyAssignment({
    name: name,
    expresion: base.createObjectLiteralExpression({ 
      properties: Object.entries(values).map(([key, value]) => base.createPropertyAssignment({
        name: key,
        expresion: value
      }))
    })
  });
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y un valor de matriz.
 */
export function createPropertyAssignmentArray(name: string, values: ts.Expression[] | string[], options?: { multiLine?: boolean, typeString?: 'string' | 'identifier' | 'template' }) {
  return base.createPropertyAssignment({
    name: name,
    expresion: base.createArrayLiteralExpression({ elements: values, ...options })
  });
}
/**
 * Crea un nodo de acceso a propiedad de importación dinámica.
 */
export function createPropertyAccessDinamicImport(importPath: string) {
  return base.createPropertyAccessExpression({
    expression: createImportCall(importPath),
    name: base.createIdentifier('then')
  });
}
/**
 * Crea un nodo de asignación de propiedad de importación dinámica con una función de flecha.
 */
export function createPropertyAssignmentDinamicImport(name: string, importPath: string, paramName: string, accessName: string) {
  return base.createPropertyAssignment({
    name: name,
    expresion: base.createArrowFunction({
      expression: base.createCallExpression({
        expression: createPropertyAccessDinamicImport(importPath),
        argumentsArray: [base.createArrowFunction({
          parameters: [base.createParameterDeclaration({
            name: base.createIdentifier(paramName)
          })],
          expression: base.createPropertyAccessExpression({
            expression: base.createIdentifier(paramName),
            name: base.createIdentifier(accessName)
          })
        })]
      })
    })
  });
}
/**
 * Crea un nodo de referencia de tipo de TypeScript con el nombre y los argumentos de tipo proporcionados.
 */
export interface CreateTypeReferenceOptions {
  name: string;
  typeArguments?: Array<string | CreateTypeReferenceOptions>;
}
export function createTypeReference(options: CreateTypeReferenceOptions ): ts.TypeReferenceNode {
  return base.createTypeReferenceNode({
    name: options.name,
    typeArguments: options.typeArguments?.map(arg => {
      if (typeof arg === 'string') {
        return createTypeReference({ name: arg });
      }
      return createTypeReference({ name: arg.name, typeArguments: arg.typeArguments });
    })
  });
}
/**
 * Crea un nodo de asignación de propiedad de TypeScript con un nombre y un valor de tipo.
 */
export function createParameterType(options: {
  name: string; 
  typeName: string; 
  typeArguments?: Array<string | CreateTypeReferenceOptions> 
}) {
  return base.createParameterDeclaration({
    name: base.createIdentifier(options.name),
    type: createTypeReference({ name: options.typeName, typeArguments: options.typeArguments })
  });
}
/** 
 * Crea un nodo de declaración de método de TypeScript con el nombre, los parámetros y el tipo de retorno proporcionados.
 */
export function createMethodType(options: {
  name: string, 
  parameters?: { 
    name: string; 
    typeName: string; 
    typeArguments?: string[] | CreateTypeReferenceOptions[] 
  }[], 
  type?: string | CreateTypeReferenceOptions,
  body?: ts.Statement[]
}) {
  return base.createMethodDeclaration({
    name: base.createIdentifier(options.name),
    parameters: options.parameters?.map(param => createParameterType(param)) ?? [],
    type: options.type ? 
      (typeof options.type === 'string' ?
        createTypeReference({ name: options.type }) : 
        createTypeReference(options.type)
      ) : undefined,
    body: options.body ? base.createBlock({
      statements: options.body,
      multiLine: true,
    }) : undefined
  });
}
/**
 * 
 */
export function createInterface(options: {
  export?: boolean
  modifiers?: ts.ModifierLike[], 
  name: string | ts.Identifier, 
  typeParameters?: ts.TypeParameterDeclaration[], 
  heritageClauses?: ts.HeritageClause[], 
  members?: ts.TypeElement[]
}) {
  return base.createInterfaceDeclaration({
    modifiers: options?.export ? [
      ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), 
      ...(options.modifiers ?? [])
    ] : options.modifiers,
    name: options.name,
    typeParameters: options.typeParameters,
    heritageClauses: options.heritageClauses,
    members: options.members ?? []
  })
}
/**
 * 
 */
export function createImport(options: {
  import: string | ts.Expression
  namedImports?: Array<string | { name: string, as: string }>
  typeString?: 'string' | 'identifier' | 'template'
}) {
  return base.createImportDeclaration({
    moduleSpecifier: typeof options.import === 'string' ? base.createStringLiteral(options.import) : options.import,
    importClause: base.createImportClause({
      namedBindings: base.createNamedImports({
        elements: options.namedImports?.map(named => base.createImportSpecifier({
          name: typeof named === 'string' ? named : named.as,
          propertyName: typeof named === 'string' ? undefined : named.name,
          typeString: options.typeString
        })) ?? []
      })
    })
  })
}
/**
 * 
 */
export function createReturn(expression: string | ts.Expression) {
  return base.createReturnStatement(
    typeof expression === 'string' ? base.createIdentifier(expression) : expression
  )
}
/**
 * 
 */
export function createPropertyAccess(options: {
  expression: ts.Expression | string,
  name: ts.MemberName | string | string[]
}) {

  if (Array.isArray(options.name)) {
    return options.name.reduce<ts.Expression>(
      (previousValue, currentValue) => base.createPropertyAccessExpression({ expression: previousValue, name: currentValue }),
      typeof options.expression === 'string' ? base.createIdentifier(options.expression) : options.expression
    )
  }
  return base.createPropertyAccessExpression({ 
    expression: typeof options.expression === 'string' ? base.createIdentifier(options.expression) : options.expression, 
    name: options.name 
  })
}
/**
 * 
 */
export function createPropertyAccessArray(array: string[], options?: { this?: boolean }) {
  if (!options?.this) {
    const [expression, ...name] = array;
    return  createPropertyAccess({ expression, name })
  } 
  return createPropertyAccess({
    expression: ts.factory.createThis(),
    name: array,
  })
}
/**
 * 
 */
export function createCall(options: {
  expression: ts.Expression | string, 
  types?: Array<string | CreateTypeReferenceOptions>, 
  arguments?: Array<ts.Expression | string>
}) {
  return base.createCallExpression({
    expression: typeof options.expression === 'string' ? base.createIdentifier(options.expression) : options.expression,
    typeArguments: options.types?.map(arg => typeof arg === 'string' ? 
      createTypeReference({ name: arg }): 
      createTypeReference({ name: arg.name, typeArguments: arg.typeArguments })
    ),
    argumentsArray: options.arguments?.map((arg) => typeof arg === 'string' ? base.createIdentifier(arg) : arg)
  })
}
/**
 * Crea un nodo de expresión de objeto literal de TypeScript a partir de las propiedades proporcionadas.
 */
export function createObject(
  properties: ts.ObjectLiteralElementLike[] | { [key: string]: ts.Expression }, 
  options?: { multiLine?: boolean }
) {
  return ts.factory.createObjectLiteralExpression(
    Array.isArray(properties) ? properties : Object.entries(properties).map(value =>
      base.createPropertyAssignment({
        name: value[0], 
        expresion: value[1],
      })
    ), 
    options?.multiLine ?? true
  );
}
/**
 * 
 */
export function createFunction(options: {
  export?: boolean
  asteriskToken?: ts.AsteriskToken,
  modifiers?: ts.ModifierLike[], 
  name?: string
  typeParameters?: ts.TypeParameterDeclaration[], 
  parameters?: { 
    name: string; 
    typeName: string; 
    typeArguments?: string[] | CreateTypeReferenceOptions[] 
  }[], 
  type?: string | CreateTypeReferenceOptions,
  body?: ts.Statement[]
}) {
  return base.createFunctionDeclaration({
    modifiers: options?.export ? [
      ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), 
      ...(options.modifiers ?? [])
    ] : options.modifiers,
    asteriskToken: options.asteriskToken,
    name: options.name ? base.createIdentifier(options.name) : undefined,
    typeParameters: options.typeParameters,
    parameters: options.parameters?.map(param => createParameterType(param)) ?? [],
    type: options.type ? 
      (typeof options.type === 'string' ?
        createTypeReference({ name: options.type }) : 
        createTypeReference(options.type)
      ) : undefined,
    body: options.body ? base.createBlock({
      statements: options.body,
      multiLine: true,
    }) : undefined
  })
}
/**
 *
 */
export function addComment<T extends ts.Node>(options: {
  node: T, 
  isMultiline?: boolean,
  text: string | string[], 
  hasTrailingNewLine?: boolean
}) {
  const parseTextFn = () => {
    if (Array.isArray(options.text)) {
      return options.text.map((text, index, array) => {
        const start = index == 0 ? '*' : '';
        const end = index == (array.length - 1 )? '\n *' : '';
        return options.isMultiline ? `${start}\n * ${text}${end}`: `// ${text}`
      }).join('')
    } else {
      return options.text;
    }
  }

  base.addSyntheticLeadingComment({
    node: options.node,
    kind: options.isMultiline ? ts.SyntaxKind.MultiLineCommentTrivia : ts.SyntaxKind.SingleLineCommentTrivia,
    text: parseTextFn(),
    hasTrailingNewLine: options.hasTrailingNewLine
  });

  return options.node;
}