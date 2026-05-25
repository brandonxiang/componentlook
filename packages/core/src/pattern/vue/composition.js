import ts from 'typescript';

/**
 * @param {ts.PropertyName} name
 */
function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return name.getText();
}

/**
 * @param {ts.ObjectLiteralExpression} node
 */
function hasSetupProperty(node) {
  return node.properties.some((property) => {
    if (ts.isPropertyAssignment(property) || ts.isMethodDeclaration(property)) {
      return getPropertyName(property.name) === 'setup';
    }

    return false;
  });
}

/**
 * @param {ts.ObjectLiteralExpression} node
 */
function isExportDefaultObject(node) {
  const parent = node.parent;

  return (
    ts.isExportAssignment(parent) ||
    (
      ts.isParenthesizedExpression(parent) &&
      ts.isExportAssignment(parent.parent)
    )
  );
}

/**
 * @param {ts.ObjectLiteralExpression} node
 */
function isVueComponentCallArgument(node) {
  const parent = node.parent;
  if (!ts.isCallExpression(parent) || parent.arguments[0] !== node) return false;

  const expression = parent.expression;
  if (ts.isIdentifier(expression)) {
    return expression.text === 'defineComponent';
  }

  return (
    ts.isPropertyAccessExpression(expression) &&
    expression.name.text === 'extend' &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === 'Vue'
  );
}

/**
 * @param {ts.SourceFile} sourceFile
 */
function getVueNamedImports(sourceFile) {
  const vueImports = new Set();

  sourceFile.statements.forEach((statement) => {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== 'vue'
    ) {
      return;
    }

    const namedBindings = statement.importClause?.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) return;

    namedBindings.elements.forEach((element) => {
      vueImports.add(element.name.text);
    });
  });

  return vueImports;
}

/**
 * @param {ts.CallExpression} node
 */
function isVueCompositionCall(node) {
  const expression = node.expression;
  const compositionNames = new Set(['ref', 'reactive', 'computed', 'watch']);

  if (!ts.isIdentifier(expression) || !compositionNames.has(expression.text)) {
    return false;
  }

  return getVueNamedImports(node.getSourceFile()).has(expression.text);
}

/**
 * Check if the node is a Vue Composition API component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue Composition API component, false otherwise
 */
export const isVueCompositionAPI = (node) => {
  if (ts.isObjectLiteralExpression(node) && hasSetupProperty(node)) {
    return isExportDefaultObject(node) || isVueComponentCallArgument(node);
  }

  if (ts.isCallExpression(node)) {
    return isVueCompositionCall(node);
  }

  return false;
}
