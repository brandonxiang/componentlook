import ts from 'typescript';

/**
 * Check if the node is a Vue Composition component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue option component, false otherwise
 */export const isVueCompositionAPI = (node) => {
    // 检查是否为调用表达式
    if (ts.isCallExpression(node)) {
      // 获取调用表达式的名称
      const expression = node.expression;
      let name = "";
      if (ts.isIdentifier(expression)) {
        name = expression.text;
      } else if (ts.isPropertyAccessExpression(expression)) {
        name = expression.name.text;
      }

      // 检查是否调用了 Composition API 特征函数
      if (name === 'setup' || name === 'ref' || name === 'reactive' || name === 'computed' || name === 'watch') {
        return true;
      }
    }
    return false;
}