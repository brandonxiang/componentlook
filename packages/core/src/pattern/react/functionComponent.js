import ts from 'typescript';

/**
 * @param {ts.Node | undefined} node
 */
function containsJSX(node) {
  if (!node) return false;
  let hasJSX = false;

  const visit = (child) => {
    if (
      ts.isJsxElement(child) ||
      ts.isJsxSelfClosingElement(child) ||
      ts.isJsxFragment(child)
    ) {
      hasJSX = true;
      return;
    }

    if (!hasJSX) {
      ts.forEachChild(child, visit);
    }
  };

  visit(node);
  return hasJSX;
}

/**
 * @param {ts.ConciseBody} body
 */
function returnsJSX(body) {
  if (!ts.isBlock(body)) {
    return containsJSX(body);
  }

  return body.statements.some((statement) => (
    ts.isReturnStatement(statement) && containsJSX(statement.expression)
  ));
}

/**
 * Check whether a node is a function-style component declaration.
 *
 * @param {ts.Node} node
 */
export function isReactFunctionComponent(node) {
  if (ts.isFunctionDeclaration(node) && node.body) {
    return returnsJSX(node.body);
  }

  if (
    (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) &&
    returnsJSX(node.body)
  ) {
    return true;
  }

  return false;
}
