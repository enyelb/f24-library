
import { source } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export * from './base-update-ast';


export type ApplyChangeOptions = {
  start: number;   // posición en source.text
  end: number;     // si start === end, es una inserción
  text: string;    // texto a poner en [start, end)
  label?: string;  // para debug
} | undefined;
/**
 * ChangeType
 */
enum ChangeType {
  REPLACE,
  APPEND_START,
  APPEND_END
};
/**
 * ChangeOptions
 */
export interface ChangeOptions {
  tabs?: number,
  startNewLine?: number
  endNewLine?: number 
}

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: false });

/**
 * 
 */
function reindent(codigo: string, de: number, a: number): string {
  const regex = new RegExp(`^( {${de}})+`, 'gm');
  return codigo.replace(regex, (match) => {
    const niveles = match.length / de;
    return ' '.repeat(niveles * a);
  });
}
/**
 * imprime un nodo AST como string, usando el SourceFile para obtener el contexto de impresión.
 */
export function printNode(node: ts.Node, source: ts.SourceFile, tabSize: number): string {
  return reindent(printer.printNode(ts.EmitHint.Unspecified, node, source), 4, tabSize);
}
/**
 * Convierte un nodo AST a string aplicando el nivel de sangría especificado.
 */
export function nodeToString(node: ts.Node, source: ts.SourceFile, options?: ChangeOptions): string {
  const tabSize = 2;
  const { tabs = 0, startNewLine = 0, endNewLine = 0 } = options || {};

  const nodeString = printNode(node, source, tabSize);

  const start = startNewLine > 0 ? '\n'.repeat(startNewLine) : '';
  const end = endNewLine > 0 ? '\n'.repeat(endNewLine) : '';

  const content = `${start}${nodeString}${end}`
  if (tabs === 0) {
    return content;
  }
  const indentation = ' '.repeat(tabs * tabSize);
  return content
    .split('\n')
    .map((line) => (line.trim() ? `${indentation}${line}` : line))
    .join('\n');
}




/**
 * crea un objeto de cambio que reemplaza un nodo AST por otro, preservando comentarios y JSDoc.
 */
function createChange(source: ts.SourceFile, oldNode: ts.Node, newNode: ts.Node, type: ChangeType, options?: ChangeOptions): ApplyChangeOptions {
  let position = {
    start: oldNode.getStart(source),
    end: oldNode.getEnd(),
  }

  if (type == ChangeType.APPEND_END) {
    position = findPositionEnd(source, oldNode);
  }
  
  return {
    start: position.start,
    end: position.end,
    text: nodeToString(newNode, source, options),
    label: `${type.toString().toLowerCase().replace('_', ' ')} ${ts.SyntaxKind[oldNode.kind]}`,
  };
}

/**
 * createChangeReplace
 */
export function createChangeReplace(source: ts.SourceFile, oldNode: ts.Node, newNode: ts.Node, options?: ChangeOptions) {
  return createChange(source, oldNode, newNode, ChangeType.REPLACE, options)
}
/**
 * createChangeAppendStart
 */
export function createChangeAppendStart(source: ts.SourceFile, oldNode: ts.Node, newNode: ts.Node, options?: ChangeOptions) {
  return createChange(source, oldNode, newNode, ChangeType.APPEND_START, options)
}
/**
 * createChangeAppendEnd
 */
export function createChangeAppendEnd(source: ts.SourceFile, oldNode: ts.Node, newNode: ts.Node, options?: ChangeOptions) {
  return createChange(source, oldNode, newNode, ChangeType.APPEND_END, options)
}

/**
 * 
 * @param source 
 * @param oldNode 
 * @param newNode 
 * @returns 
 */
export function findPositionEnd(source: ts.SourceFile, oldNode: ts.Node) {
  const lastToken = oldNode.getLastToken(source);

  if (lastToken) {
    if (lastToken.kind === ts.SyntaxKind.CloseBraceToken) {
      return {
        start: lastToken.getStart(source),
        end: lastToken.getStart(source),
      }
    }
  }

  return {
    start: oldNode.getEnd(),
    end: oldNode.getEnd() 
  }
}
/**
 * aplica una lista de cambios a un string original, devolviendo el string modificado. 
 */
export function applyChanges(original: string | ts.SourceFile, changes: ApplyChangeOptions[]): string {
  return [...changes]
    .filter(change => change !== undefined)
    .map((change, index) => ({ ...change, index }))
    .sort((a, b) => b.start - a.start || b.end - a.end || b.index - a.index)
    .reduce(
      (acc, e) => acc.slice(0, e.start) + e.text + acc.slice(e.end),
      typeof original === 'string' ? original : original.getFullText(),
    );
}
