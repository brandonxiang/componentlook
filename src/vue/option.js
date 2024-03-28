import ts from 'typescript';

/**
 * Check if the node is a Vue Composition component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue option component, false otherwise
 */
export const isVueOptionAPI = (node) => {

    // 检查是否为对象字面量表达式
    if (ts.isObjectLiteralExpression(node)) {
      // 检查对象字面量的属性
      for (let index = 0; index < node.properties.length; index++) {
        const property = node.properties[index];
        if (ts.isPropertyAssignment(property)) {
          const name = property.name.getText();
          // 检查是否是 Options API 的特征属性
          if (name === 'data' || name === 'methods' || name === 'computed' || name === 'watch') {
            return true;
          }
        }
      }
    }
    return false;
}