  import ts from 'typescript';
  
  /**
   * 检查节点是否为函数式 JSX 元素
   * @param {ts.Node} node 
   */
  export function isReactFunctionComponent(node) {
    return node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxSelfClosingElement;
  }