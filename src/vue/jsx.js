import ts from "typescript";

/**
 * Check if the node is a Vue Composition component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue option component, false otherwise
 */
export const isVueJSX = (node) => {
  let usesJSX = false;

  const checkForJSXElement = (node) => {
    // 检查节点是否是 JSX 元素或 JSX 自闭合元素
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) {
      usesJSX = true;
    }
    // 深度优先遍历子节点
    if (!usesJSX) {
      ts.forEachChild(node, checkForJSXElement);
    }
  };


  // 检查是否为 render 方法
  if (ts.isMethodDeclaration(node) && node.name.getText() === 'render') {
    // 检查 render 方法体内的返回语句
    if (node.body) {
      node.body.forEachChild((child) => {
        if (ts.isReturnStatement(child) && child.expression) {
          // 检查返回语句中的 JSX 元素
          checkForJSXElement(child.expression);
        }
      });
    }
  }
  // 检查函数表达式，可能是无状态组件
  else if (ts.isVariableStatement(node)) {
    for (const declaration of node.declarationList.declarations) {
      if (declaration.initializer && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))) {
        const functionBody = declaration.initializer.body;
        if (ts.isBlock(functionBody)) {
          functionBody.statements.forEach((statement) => {
            if (ts.isReturnStatement(statement) && statement.expression) {
              checkForJSXElement(statement.expression);
            }
          });
        } else if (functionBody) {
          // 当函数体是一个单一表达式时，它可能直接返回 JSX
          checkForJSXElement(functionBody);
        }
      }
    }
  }
  return usesJSX;
};
