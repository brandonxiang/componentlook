import ts from "typescript";
import { isReactFunctionComponent } from "./pattern/react/functionComponent.js";
import { isReactClassComponent } from "./pattern/react/classComponent.js";
import { isVueClassAPI } from "./pattern/vue/class.js";
import { isVueJSX } from "./pattern/vue/jsx.js";
import { isVueCompositionAPI } from "./pattern/vue/composition.js";
import { isVueOptionAPI } from "./pattern/vue/option.js";
import { COMPONENT_TYPE } from "./constant/index.js";
import path from "path";
import { printResult } from "./utils/index.js";
import { getDependencies, readJson } from "./utils/string.js";
import { existsSync } from "fs";


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
 * @param {{tsconfig?: string}} [options]
 * @returns
 */
export async function parse(_entry, options) {
  const entry = _entry.map((m) => path.resolve(m));
  const defaultTsconfigPath = path.resolve("tsconfig.json");
  const defaultPackageJsonPath = path.resolve("package.json");
  if(!existsSync(defaultPackageJsonPath)) {
    console.error('Please run at the workspace root. ');
    process.exit(-1);
  }
  if(!existsSync(defaultTsconfigPath)) {
    console.error('Please add a tsconfig at the workspace root, or customize it. ');
    process.exit(-1);
  }
  const tsConfig = await readJson(options?.tsconfig || defaultTsconfigPath);
  const packageJson = await readJson(defaultPackageJsonPath);
  const dependencies = getDependencies(packageJson);
  const isReact = dependencies.has('react');
  const isVue = dependencies.has('vue');


  let cache = new Map();
  /** @type {ts.SourceFile | null} */
  let currentSourceFile = null;
  /** @param {ts.Node} node */
  const visit = (node) => {
    if(isReact) {
      if (isReactFunctionComponent(node)) {
        cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.REACT_FUNCTION);
      }
  
      if (isReactClassComponent(node)) {
        cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.REACT_CLASS);
      }
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
