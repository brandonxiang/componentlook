import ts from "typescript";
import { isReactFunctionComponent } from "./pattern/react/functionComponent.js";
import { isReactClassComponent } from "./pattern/react/classComponent.js";
import { isVueClassAPI } from "./pattern/vue/class.js";
import { isVueJSX } from "./pattern/vue/jsx.js";
import { isVueCompositionAPI } from "./pattern/vue/composition.js";
import { isVueOptionAPI } from "./pattern/vue/option.js";
import { COMPONENT_TYPE, baseCompilerOptions } from "./constant/index.js";
import path from "path";
import { printResult, convertResult } from "./utils/index.js";
import { getDependencies, readJson } from "./utils/string.js";
import { existsSync } from "fs";
import { createHost } from "./typescript/create-host.js";
import { componentScanner } from './slim.js';
 


/**
 *
 * @param {string[]} _entry
 * @param {{tsconfig?: string, packageJson?: string}} [options]
 * @returns
 */
export async function projectScanner(_entry, options) {
  const entry = _entry.map((m) => path.resolve(m));
  entry.forEach((e) => {
    if (!existsSync(e)) {
      console.error('Entry file not found. ');
      process.exit(-1);
    }
  });

  const defaultTsconfigPath = path.resolve("tsconfig.json");
  const defaultPackageJsonPath = path.resolve("package.json");
  if (!existsSync(defaultPackageJsonPath)) {
    console.error('Please run at the workspace root. ');
    process.exit(-1);
  }
  if (!existsSync(defaultTsconfigPath)) {
    console.error('Please add a tsconfig at the workspace root, or customize it. ');
    process.exit(-1);
  }
  const tsConfig = await readJson(options?.tsconfig || defaultTsconfigPath);

  const compilerOptions = {
    ...tsConfig.compilerOptions,
    ...baseCompilerOptions,
    allowNonTsExtensions: true,
  }

  delete compilerOptions.moduleResolution;
  const packageJson = await readJson(options?.packageJson || defaultPackageJsonPath);
  
  const dependencies = getDependencies(packageJson);
  const isReact = dependencies.has('react');
  const isVue = dependencies.has('vue');


  /**
   * A Map to store cached values.
   * @type {Map<string, string>}
   */
  let cache = new Map();
  /** @type {ts.SourceFile | null} */
  let currentSourceFile = null;
  /** @param {ts.Node} node */
  const visit = (node) => {
    if (isReact && currentSourceFile?.fileName) {
      if (isReactFunctionComponent(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.REACT_FUNCTION);
      }

      if (isReactClassComponent(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.REACT_CLASS);
      }
    }

    if (isVue && currentSourceFile?.fileName) {
      if (isVueJSX(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.VUE_JSX);
      }

      if (isVueOptionAPI(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.VUE_OPTION);
      }

      if (isVueClassAPI(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.VUE_CLASS);
      }

      if (isVueCompositionAPI(node)) {
        cache.set(currentSourceFile.fileName, COMPONENT_TYPE.VUE_COMPOSITION);
      }
    }

    if (currentSourceFile?.fileName && !cache.get(currentSourceFile.fileName)) {
      ts.forEachChild(node, visit);
    }
  };

  const compilerHost = createHost({ compilerOptions });

  const program = ts.createProgram(entry, compilerOptions, compilerHost);

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

  return cache;
}


/**
 *
 * @param {string[]} _entry
 * @param {{tsconfig?: string, packageJson?: string}} [options]
 * @returns
 */
export async function parse(_entry, options) {
  const res = await projectScanner(_entry, options);
  printResult(res);
}

export { convertResult, componentScanner }