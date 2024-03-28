import ts from 'typescript';

/**
 * Check if the node is a Vue Composition component.
 *
 * @param {ts.Node} node - the node to be checked
 * @return {boolean} true if the node is a Vue option component, false otherwise
 */
export const isVueClassAPI = (node) => {
    // 检查是否为类声明
    if (ts.isClassDeclaration(node)) {
      //@ts-ignore
      const decorators = node.decorators;
  
      // 检查是否有装饰器
      if (decorators) {
        for (let index = 0; index < decorators.length; index++) {
          const decorator = decorators[index];

          if (ts.isCallExpression(decorator.expression) && decorator.expression.expression.getText() === 'Component') {
            return true;
          }
        }
      }
      // 检查是否继承了 Vue
      if (node.heritageClauses) {
        for (let i = 0; i < node.heritageClauses.length; i++) {
          const clause = node.heritageClauses[i];
          for (let j = 0; j < clause.types.length; j++) {
            const type = clause.types[j];


            // TODO：有 bug
            if (type.expression.getText() === 'Vue') {
              return true;
            }
          }
        }
      }
    }
   return false;
}
