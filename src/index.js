import ts from "typescript";
import { isReactFunctionComponent } from "./react/functionComponent.js";
import { isReactClassComponent } from "./react/classComponent.js";
import { isVueClassAPI } from "./vue/class.js";
import { isVueJSX } from "./vue/jsx.js";
import { isVueCompositionAPI } from "./vue/composition.js";
import { isVueOptionAPI } from "./vue/option.js";
import { COMPONENT_TYPE } from "./constant/index.js";
import path from "path";
import { printResult, readJson } from "./utils/index.js";


/**
 *
 * @param {ts.SourceFile} sourceFile
 * @returns
 */
export function componentScanner(sourceFile) {
  let containsJsxElement = false;

  /**
   *
   * @param {ts.Node} node
   */
  const visit = (node) => {
    if (isReactFunctionComponent(node)) {
      console.log("is React Function Component");
      containsJsxElement = true;
    }

    if (isReactClassComponent(node)) {
      console.log("is React Class Component");
      containsJsxElement = true;
    }

    // if(isVueJSX(node)) {
    //   console.log('is Vue JSX API');
    //   containsJsxElement = true;
    // }

    if (isVueClassAPI(node)) {
      console.log("is Vue Class API");
      containsJsxElement = true;
    }

    if (isVueCompositionAPI(node)) {
      console.log("is Vue Composition API");
      containsJsxElement = true;
    }

    if (isVueOptionAPI(node)) {
      console.log("is Vue Option API");
      containsJsxElement = true;
    }

    // 如果已经找到 JSX 元素，则不需要进一步遍历子节点
    if (!containsJsxElement) {
      ts.forEachChild(node, visit);
    }
  };

  visit(sourceFile);

  return containsJsxElement;
}

/**
 *
 * @param {string[]} _entry
 * @param {{tsconfig?: string}} options
 * @returns
 */
export async function parse(_entry, options) {
  const entry = _entry.map((m) => path.resolve(m));
  const defaultTsconfigPath = path.resolve("tsconfig.json");

  console.log(options.tsconfig || defaultTsconfigPath);
  const tsConfig = await readJson(options.tsconfig || defaultTsconfigPath);

  console.log(tsConfig);

  let cache = new Map();
  /** @type {ts.SourceFile | null} */
  let currentSourceFile = null;
  /** @param {ts.Node} node */
  const visit = (node) => {
    if (isReactFunctionComponent(node)) {
      cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.REACT_FUNCTION);
    }

    if (isReactClassComponent(node)) {
      cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.REACT_CLASS);
    }

    // if(isVueJSX(node)) {
    //   console.log(currentSourceFile?.fileName, 'is Vue JSX API');
    //   cache.set(currentSourceFile?.fileName,  'is Vue JSX API');
    // }

    // if(isVueOptionAPI(node)) {
    //   cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.VUE_OPTION);
    // }

    // if(isVueClassAPI(node)) {
    //   cache.set(currentSourceFile?.fileName,  COMPONENT_TYPE.VUE_CLASS);
    // }

    // if(isVueCompositionAPI(node)) {
    //   cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.VUE_COMPOSITION);
    // }

    if (!cache.get(currentSourceFile?.fileName)) {
      ts.forEachChild(node, visit);
    }
  };
  const program = ts.createProgram(entry, tsConfig.compilerOptions);

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes("node_modules")
    );
  });

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    ts.forEachChild(sourceFile, visit);
  });

  printResult(cache);
}
