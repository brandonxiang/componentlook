import ts from 'typescript';



/**
 * 
 * @param {ts.Node} node 
 */
export function isReactClassComponent(node) {
    // 检查是否是类声明
    if (ts.isClassDeclaration(node)) {
      // 检查类是否继承自 React.Component 或 React.PureComponent
      if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            for (const type of clause.types) {
              const expression = type.expression;
              // 这里假设你已经导入了React，并且组件继承自React.Component或React.PureComponent
              // 你可能需要根据你的代码基调整这个逻辑，以处理不同的导入或别名
              if (ts.isIdentifier(expression) && (expression.text === 'Component' || expression.text === 'PureComponent')) {
                return true;
              }
              // 处理默认导入或具名导入的情况（例如 import React from 'react' 或 import * as React from 'react'）
              if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
                if ((expression.name.text === 'Component' || expression.name.text === 'PureComponent') &&
                    ts.isIdentifier(expression.expression) && expression.expression.text === 'React') {
                  return true;
                }
              }
            }
          }
        }
      }
  
      // 检查类是否有 render 方法
      if (node.members) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name) && member.name.text === 'render') {
            return true;
          }
        }
      }
    }
  
    return false;
}
