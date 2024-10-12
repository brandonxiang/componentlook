import ts from "typescript";
import { isReactFunctionComponent } from "./pattern/react/functionComponent.js";
import { isReactClassComponent } from "./pattern/react/classComponent.js";
import { isVueClassAPI } from "./pattern/vue/class.js";
import { isVueJSX } from "./pattern/vue/jsx.js";
import { isVueCompositionAPI } from "./pattern/vue/composition.js";
import { isVueOptionAPI } from "./pattern/vue/option.js";
import { COMPONENT_TYPE } from "./constant/index.js";

/**
 *
 * @param {ts.SourceFile} sourceFile
 * @returns
 */
export function componentScanner(sourceFile) {
  let containsJsxElement = false;
  let componentType = '';

  /**
   *
   * @param {ts.Node} node
   */
  const visit = (node) => {
    if (isReactFunctionComponent(node)) {
      console.log("is React Function Component");
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.REACT_FUNCTION;
    }

    if (isReactClassComponent(node)) {
      console.log("is React Class Component");
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.REACT_CLASS;
    }

    // if(isVueJSX(node)) {
    //   console.log('is Vue JSX API');
    //   containsJsxElement = true;
    // }

    if (isVueClassAPI(node)) {
      console.log("is Vue Class API");
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_CLASS;
    }

    if (isVueCompositionAPI(node)) {
      console.log("is Vue Composition API");
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_COMPOSITION;
    }

    if (isVueOptionAPI(node)) {
      console.log("is Vue Option API");
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_OPTION;
    }

    // 如果已经找到 JSX 元素，则不需要进一步遍历子节点
    if (!containsJsxElement) {
      ts.forEachChild(node, visit);
    }
  };

  visit(sourceFile);

  return componentType;
}
