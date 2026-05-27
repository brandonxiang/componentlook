import ts from "typescript";
import { isReactFunctionComponent } from "./pattern/react/functionComponent.js";
import { isReactClassComponent } from "./pattern/react/classComponent.js";
import { isVueClassAPI } from "./pattern/vue/class.js";
import { isVueJSX } from "./pattern/vue/jsx.js";
import { isVueCompositionAPI } from "./pattern/vue/composition.js";
import { isVueOptionAPI } from "./pattern/vue/option.js";
import { COMPONENT_TYPE } from "./constant/index.js";

/**
 * @param {string} fileName
 * @returns {ts.ScriptKind}
 */
function getScriptKind(fileName) {
  if (fileName.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (fileName.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (fileName.endsWith(".ts")) return ts.ScriptKind.TS;
  if (fileName.endsWith(".vue")) return ts.ScriptKind.TSX;

  return ts.ScriptKind.JS;
}

/**
 * Detect the first component writing style in a source string.
 *
 * @param {string} fileContent
 * @param {{fileName?: string}} [options]
 * @returns {string}
 */
export function detectComponentType(fileContent, options = {}) {
  const fileName = options.fileName || "Component.tsx";
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(fileName)
  );

  return componentScanner(sourceFile);
}

/**
 * Check whether a source string matches a specific component writing style.
 *
 * @param {string} componentType
 * @param {string} fileContent
 * @param {{fileName?: string}} [options]
 * @returns {boolean}
 */
export function isComponentType(componentType, fileContent, options = {}) {
  return detectComponentType(fileContent, options) === componentType;
}

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
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.REACT_FUNCTION;
    }

    if (isReactClassComponent(node)) {
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.REACT_CLASS;
    }

    if (isVueJSX(node)) {
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_JSX;
    }

    if (isVueClassAPI(node)) {
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_CLASS;
    }

    if (isVueCompositionAPI(node)) {
      containsJsxElement = true;
      componentType = COMPONENT_TYPE.VUE_COMPOSITION;
    }

    if (isVueOptionAPI(node)) {
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

export { COMPONENT_TYPE };
