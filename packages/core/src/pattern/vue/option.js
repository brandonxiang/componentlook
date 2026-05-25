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
function hasOptionsAPIProperty(node) {
  const optionNames = new Set(['data', 'methods', 'computed', 'watch']);

  return node.properties.some((property) => {
    if (
      ts.isPropertyAssignment(property) ||
      ts.isMethodDeclaration(property) ||
      ts.isGetAccessorDeclaration(property)
    ) {
      return optionNames.has(getPropertyName(property.name));
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
 * Check if the node is a Vue Options API component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue options component, false otherwise
 */
export const isVueOptionAPI = (node) => {
  if (!ts.isObjectLiteralExpression(node) || !hasOptionsAPIProperty(node)) {
    return false;
  }

  return isExportDefaultObject(node) || isVueComponentCallArgument(node);
}
