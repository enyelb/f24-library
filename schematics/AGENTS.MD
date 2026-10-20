# AGENTS

## src/ast/find-ast.ts

Utilería de búsqueda y manipulación de árboles AST (Abstract Syntax Tree) sobre archivos TypeScript/ Angular, usada por los schematics para localizar nodos concretos dentro de un archivo y editarlos de forma programática.

### Qué hace

- **Recorrido genérico (`visitor`)**: recorre recursivamente un nodo raíz (SourceFile, Block, etc.) aplicando un `visitorFn` a cada nodo. Soporta:
  - `findAll?: boolean` → devuelve el primer nodo encontrado o un arreglo con todas las coincidencias.
  - `validate?: (node) => boolean` → filtro adicional sobre el nodo candidato.
  - `parent?: number` → sube N niveles en la jerarquía antes de evaluar el nodo.
- **`findParent(source, level)`**: devuelve el nodo padre a N niveles hacia arriba.
- **Localizadores por tipo de nodo** (todos comparten la misma firma `source + options → nodo | nodo[] | undefined`):
  - `findClass` → `ClassDeclaration | ClassExpression` (filtro por `className`).
  - `findInterface` → `InterfaceDeclaration` (filtro por `interfaceName`).
  - `findVariable` → `VariableDeclaration` (filtros `variableName` con `match: 'start' | 'end'`, y `typeFilter` para el tipo, incluye alias `'array'`).
  - `findFunction` → `FunctionDeclaration` (filtro por `functionName`).
  - `findMethod` → `MethodDeclaration | MethodSignature` (filtro por `methodName`).
  - `findProperty` → `PropertyDeclaration` (filtro por `propertyName`).
  - `findPropertyAssignment` → `PropertyAssignment` (filtros `propertyName`, `propertyValue` y `propertyNotValue` sobre el literal inicializador).
  - `findImport` → `ImportDeclaration` (filtros `importName` = ruta del módulo, `namedImports` y `namedNotImports`).
  - `findDynamicImport` → `CallExpression` de `import(...)` (filtros `importPath` y `exportedMember`).
  - `findPropertyAccessExpression` → `CallExpression` de llamadas encadenadas (por defecto `.then`, configurable con `expressionName`).
- **Posiciones y utilidades de texto**:
  - `findLastNode` → último nodo de un arreglo de nodos.
  - `findNodeEndPosition` / `findNodeStartPosition` → posición de inicio/fin de un nodo, con búsqueda opcional hacia arriba/abajo (`type: 'up' | 'down'`) hasta encontrar uno de los caracteres indicados en `characteres`.
  - `hasNewLine` → indica si hay un salto de línea antes/después de una posición dentro de los límites dados.
- **Edición sobre el `Tree` de Angular Devkit**:
  - `updateFileInsertRight(tree, filePath, position, content)` → inserta contenido a la derecha de una posición. La implementación vive en `base-update-ast.ts` y aquí solo se reexporta por compatibilidad.
- **Depuración y acceso a archivos**:
  - `printAstTree(source, indentLevel?)` → imprime en consola la jerarquía del AST (`SyntaxKind` + preview del texto).
  - `existFile(tree, context, filePath, fn)` → verifica que el archivo exista en el `Tree`, lo parsea con `ts.createSourceFile` y ejecuta `fn(source)`; reporta errores mediante `context.logger.error`.

### Información que debe contener este archivo (estructura esperada)

1. **Tipos (`types`)**: aliases de parámetros y retorno (`TypeParam`, `TypeAllParam`, `TypeReturn`, `Options<T>`) y las opciones específicas por localizador (`ClassOptions`, `VariableOptions`, `ImportOptions`, etc.). Documentar aquí cualquier nueva opción de búsqueda que se agregue.
2. **Motor de búsqueda**: `visitor` (recorrido, `findAll`, `validate`, `parent`) y `findParent`.
3. **Localizadores exportados**: una función por tipo de nodo, siempre con la forma `findXxx(source, options?)` y JSDoc que describa: parámetros, opciones disponibles y valor de retorno.
4. **Utilidades de posición**: cálculo de offsets (`findNodeStartPosition/EndPosition`, `hasNewLine`).
5. **Utilidades de acceso/depuración**: `existFile` y `printAstTree`.

**Reglas al modificar el archivo**

- Mantener la firma común `source: TypeAllParam` + `options?: XxxOptions` en todos los `find*` para conservar la composabilidad.
- Documentar con JSDoc cada función exportada (descripción, `@param`, `@returns`), en español.
- Las opciones nuevas se agregan al tipo `Options<T>` o a la opción específica correspondiente, nunca como parámetros sueltos.
- `findAll` debe seguir devolviendo `T[]` y, en modo no-`findAll`, `T | undefined`.

## src/ast/base-create-ast.ts

Capa de creación de nodos AST: wrappers sobre `ts.factory` (la factory oficial de TypeScript) que simplifican la construcción de nodos para inyectarlos en archivos con `find-ast.ts` + `updateFileInsertRight`. No modifica archivos por sí mismo, solo devuelve nodos.

### Qué hace

- **Helpers de identificadores y literales**:
  - `createIdentifier(name)` → `ts.Identifier`.
  - `createStringLiteral(name, isSingleQuote = true)` → `ts.StringLiteral` con comillas simples por defecto (estilo del proyecto según `.editorconfig`).
  - `createString(name, isIdentifier = true)` → resuelve un `string` a identificador (por defecto) o literal de cadena; si ya es un nodo, lo devuelve tal cual. Es el helper que reutilizan casi todas las funciones.
- **Expresiones**:
  - `createObjectExpression({ properties, multiLine? })` → `ObjectLiteralExpression` (`multiLine` por defecto `true`).
  - `createPropertyAssignment({ name, expresion, isIdentifier? })` → `PropertyAssignment`.
  - `createArrowFunction({ modifiers?, typeParameters?, explicitReturnType?, parameters?, expression })` → `ArrowFunction` (siempre con `=>` como token).
  - `createCallExpression({ expression, typeArguments?, argumentsArray? })` → `CallExpression`.
  - `createPropertyAccessExpression({ expression, name })` → `PropertyAccessExpression`.
  - `createArrayLiteralExpression({ elements?, multiLine?, isIdentifier? })` → `ArrayLiteralExpression` (convierte `string[]` a nodos).
- **Declaraciones**:
  - `createParameterDeclaration(options)` → `ParameterDeclaration` (modifiers, `...rest`, nombre, `?`, tipo, inicializador).
  - `createMethodDeclaration(options)` → `MethodDeclaration` (incluye `body` opcional e `isIdentifier`).
  - `createMethodSignature(options)` → `MethodSignature` (para interfaces).
  - `createTypeReferenceNode({ name, typeArguments? })` → `TypeReferenceNode`.
- **Imports**:
  - `createImportSpecifier({ isTypeOnly?, propertyName?, name, isIdentifier? })` → `ImportSpecifier`.
  - `createNamedImports({ elements })` → `NamedImports`.
  - `createImportClause({ phaseModifier?, name?, namedBindings? })` → `ImportClause`.
  - `createImportDeclaration({ modifiers?, importClause?, moduleSpecifier, attributes?, isIdentifier? })` → `ImportDeclaration` (el `moduleSpecifier` se crea como literal, salvo que se indique lo contrario).
- **Serialización y utilidades**:
  - `nodeToString(node, tabs = 0)` → convierte un nodo AST a string con `ts.Printer` (LF, sin eliminar comentarios), normaliza la indentación a 2 espacios y aplica `tabs` niveles de sangría extra.
  - `conditionalExpressions(condition, nodes)` → devuelve los nodos si la condición es `true`, o `[]`. Útil para construir listas de propiedades/métodos de forma condicional.

### Información que debe contener este archivo (estructura esperada)

1. **Helpers base** (`createIdentifier`, `createStringLiteral`, `createString`) al inicio, ya que todo el resto depende de ellos.
2. **Agrupación por categoría de nodo**: expresiones → declaraciones → imports → serialización/utilidades.
3. **Firma por función**: siempre `export function createXxx(options: { ... })` con las opciones en un objeto de tipo explícito (no parámetros posicionales), más JSDoc en español con descripción y `@param`/`@returns`.
4. **Tabla de equivalencias**: cada wrapper debe mapear 1:1 a un método de `ts.factory` (para que sea localizable el factory original).
5. **Opciones comunes documentadas**: `isIdentifier` (controla identificador vs. literal de cadena), `multiLine`, `modifiers`, `typeParameters`.

**Reglas al modificar el archivo**

- No replicar lógica de `find-ast.ts`; este archivo solo crea nodos, no los busca ni los inserta.
- Reutilizar `createString`/`createIdentifier` en lugar de llamar directamente a `ts.factory` cuando el parámetro pueda ser `string`.
- Mantener el patrón de opciones en objeto único y valores por defecto en el cuerpo de la función (`?? true`, `?? false`, `?? []`).
- `nodeToString` debe conservar la normalización de indentación a 2 espacios: es la que usa el código insertado en los archivos destino.

## src/ast/base-update-ast.ts

Capa de actualización: convierte operaciones sobre nodos (localizados con `find*` y construidos con `create*`) en ediciones textuales exactas y las guarda en el `Tree`. Es la pieza que cierra el flujo principal de la app: **buscar → crear → insertar en un lugar concreto → guardar**.

Solo se toca el rango del nodo objetivo; el resto del archivo conserva su formato, comentarios y líneas en blanco. Ninguna función de este archivo reimprime el archivo completo.

### Qué hace

- **Updaters genéricos de nodos (espejo de `base-create-ast.ts`)**: 22 funciones con la forma `updateXxx(node, options?) → nodo actualizado` que envuelven a `ts.factory.updateXxx` y **no tocan el archivo**; el resultado se guarda con `updateNode`/`replaceNode` + `updateFile`. Agrupadas en:
  - Expresiones: `updateObjectLiteralExpression`, `updatePropertyAssignment`, `updateArrayLiteralExpression`, `updateCallExpression`, `updatePropertyAccessExpression`, `updateArrowFunction`, `updateParameterDeclaration`, `updateTypeReferenceNode`.
  - Declaraciones: `updateMethodDeclaration`, `updateMethodSignature`, `updatePropertyDeclaration`, `updateVariableDeclaration`, `updateVariableDeclarationList`, `updateVariableStatement`, `updateFunctionDeclaration`, `updateClassDeclaration`, `updateInterfaceDeclaration`, `updateBlock`.
  - Imports: `updateImportDeclaration`, `updateImportClause`, `updateNamedImports`, `updateImportSpecifier`.
  - Semántica: la opción no enviada conserva el valor actual del nodo; una propiedad opcional se limpia pasándola explícitamente como `undefined`; los `string` de nombre/módulo se convierten con `createIdentifier`/`createString` (según sea identificador o literal); `multiLine` no se expone porque `ts.factory.update*` ya lo conserva.
- **Operaciones sobre nodos** (todas devuelven `UpdateEdit[]`, una edición por nodo objetivo):
  - `insertNodeBefore(targets, nodes)` / `insertNodeAfter(targets, nodes)` → insertan nodos creados alrededor del objetivo. Elige el separador según el contexto: lista con coma (`', '`) o lista por líneas (`'\n'` + sangría de la línea destino).
  - `replaceNode(targets, nodes)` → sustituye el rango `[getStart(), getEnd()]` del objetivo.
  - `removeNode(targets)` → elimina el nodo; si ocupa una línea completa (sangría antes y solo salto de línea después), elimina la línea entera con su salto.
  - `updateNode(targets, updater)` → `updater` devuelve el nodo actualizado, varios nodos, o `undefined` para eliminarlo.
- **Aplicación de ediciones**:
  - `updateFile(tree, filePath, updates, options?)` → aplana las ediciones y las confirma en un solo `beginUpdate`/`commitUpdate` (usa `insertLeft` salvo que la posición caiga al final de un rango eliminado, donde usa `insertRight`). Devuelve `false` si el archivo no existe.
  - `readSourceFile(tree, filePath, context?)` → parsea el archivo con `ts.createSourceFile(..., true)` para empezar el flujo con `find*`.
- **Detección de listas (`isCommaSeparatedList`)**: primero mira el texto real entre hermanos (si hay `,` entre ellos es lista con coma; si hay salto de línea, es lista por líneas) y, cuando no hay hermanos, usa `COMMA_LIST_PARENTS` (CallExpression, ArrayLiteralExpression, ObjectLiteralExpression, NamedImports, funciones/métodos para parámetros, etc.).
- **Impresión del código nuevo**:
  - `printNode(node, source)` → `ts.Printer` con LF y comentarios activos; normaliza la sangría relativa del printer (4 espacios por nivel) a 2 espacios.
  - `formatNodes(nodes, source, indent, separator)` → aplica la sangría de la línea destino a todas las líneas salvo la primera (que se coloca en la posición actual).
- **Validación**: `assertSiblingList` comprueba que el nodo esté dentro de una lista de hermanos antes de insertar; si ocupa una posición individual lanza un error que indica usar `replaceNode`.
- **Recorder y posiciones (edición textual directa)**:
  - `updateFileRecorder(tree, filePath, action)` → agrupar varias inserciones en un solo commit.
  - `updateFileInsertRight` (reubicada aquí desde `find-ast.ts`, que la reexporta por compatibilidad), `updateFileInsertLeft`, `updateFileReplace`, `updateFileRemove`, `updateFileOverwrite`.
  - Atajos sobre nodos: `insertTextAfterNode`, `insertTextBeforeNode`, `replaceNodeText`, `removeNodeText`.

### Información que debe contener este archivo (estructura esperada)

1. **Tipos**: `NodeOrNodes`, `NodeUpdater`, `UpdateEdit` (`start`, `end`, `text` sobre el texto original), `UpdateInput` y `UpdateFileOptions`.
2. **Constantes de contexto**: `COMMA_LIST_PARENTS` con los tipos de nodo cuyos hijos se separan por coma.
3. **Updaters**: bloque de funciones `updateXxx(node, options?)` ubicado después de `ChildArrayInfo` y antes de `toNodes`, ordenado expresiones → declaraciones → imports, una por método de `ts.factory.update*` con el mismo nombre.
4. **Helpers internos**: `toNodes`, `findChildArray`, `assertSiblingList`, `lineStart`/`lineEnd`/`lineIndent`, `isCommaSeparatedList`, `printNode`, `formatNodes`, `createInsertEdit`/`createReplaceEdit`/`createRemoveEdit`, `flattenUpdates`, `applyEdits`.
5. **Operaciones exportadas**: `insertNodeBefore`, `insertNodeAfter`, `replaceNode`, `removeNode`, `updateNode` → siempre `UpdateEdit[]`.
6. **Acceso a archivos y recorder**: `readSourceFile`, `updateFile`, `updateFileRecorder`, `updateFileInsert*`, `updateFileReplace`, `updateFileRemove`, `updateFileOverwrite` y los atajos por nodo.
7. **JSDoc en español** en cada export con `@param`, `@returns` y `@throws`.

**Reglas al modificar el archivo**

- Los offsets se calculan siempre desde el `SourceFile` original con `getStart()`/`getEnd()`: después de cada `updateFile` hay que volver a parsear con `readSourceFile` antes de localizar otros nodos.
- Nunca reimprimir el archivo completo (pierde líneas en blanco y reformatea); las ediciones deben seguir siendo rangos quirúrgicos sobre el texto original.
- No combinar dos ediciones sobre el mismo nodo en una misma llamada a `updateFile` (los rangos se solapan y el recorder las rechaza).
- `insertNodeBefore`/`insertNodeAfter` solo sobre nodos de una lista de hermanos; para posiciones individuales usar `replaceNode`.
- Mantener la separación de responsabilidades: este archivo no localiza nodos (eso es `find-ast`) ni los construye (eso es `create-ast`/`base-create-ast`).
- En los `updateXxx` usar `?? node.x` para los parámetros que el factory exige y `'x' in opts ? opts.x : node.x` solo para los opcionales que se quieran poder limpiar con `undefined`.
- Cuando el factory exige un `NodeArray` (`typeParameters`/`typeArguments` de `updateMethodSignature` y `updateTypeReferenceNode`), convertir el arreglo recibido con `ts.factory.createNodeArray(...)`; en los demás casos pasar `readonly T[]` tal cual.
- No guardar ni imprimir el archivo desde un updater: devuelve el nodo y deja el guardado en `updateFile`, que escribe solo el rango del nodo.
