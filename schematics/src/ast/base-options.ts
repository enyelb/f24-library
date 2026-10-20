import ts from "typescript";

/**
 * ImportDeclarationOptions
 */
export interface ImportDeclarationOptions {
  modifiers?: ts.ModifierLike[], 
  importClause?: ts.ImportClause, 
  moduleSpecifier: ts.Expression, 
  attributes?: ts.ImportAttributes
  isIdentifier?: boolean;
}