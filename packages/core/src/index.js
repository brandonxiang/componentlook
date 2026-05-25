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
 
export class ScannerError extends Error {
  /**
   * @param {string} message
   * @param {string} code
   */
  constructor(message, code) {
    super(message);
    this.name = 'ScannerError';
    this.code = code;
  }
}


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
      throw new ScannerError(`Entry file not found: ${e}`, 'ENTRY_NOT_FOUND');
    }
  });

  const tsconfigPath = path.resolve(options?.tsconfig || "tsconfig.json");
  const packageJsonPath = path.resolve(options?.packageJson || "package.json");

  if (!existsSync(packageJsonPath)) {
    throw new ScannerError(
      `Package manifest not found: ${packageJsonPath}. Run from the workspace root or pass packageJson.`,
      'PACKAGE_JSON_NOT_FOUND'
    );
  }
  if (!existsSync(tsconfigPath)) {
    throw new ScannerError(
      `TypeScript config not found: ${tsconfigPath}. Add tsconfig.json or pass tsconfig.`,
      'TSCONFIG_NOT_FOUND'
    );
  }
  const tsConfig = await readJson(tsconfigPath);

  const compilerOptions = {
    ...tsConfig.compilerOptions,
    ...baseCompilerOptions,
    allowNonTsExtensions: true,
  }

  delete compilerOptions.moduleResolution;
  const packageJson = await readJson(packageJsonPath);
  
  const dependencies = getDependencies(packageJson);
  const isReact = dependencies.has('react');
  const isVue = dependencies.has('vue');


  /**
   * A Map to store cached values.
   * @type {Map<string, Set<string>>}
   */
  let cache = new Map();
  /** @type {ts.SourceFile | null} */
  let currentSourceFile = null;
  /** @param {string} componentType */
  const addComponentType = (componentType) => {
    if (!currentSourceFile?.fileName) return;

    const currentTypes = cache.get(currentSourceFile.fileName) || new Set();
    currentTypes.add(componentType);
    cache.set(currentSourceFile.fileName, currentTypes);
  };

  /** @param {ts.Node} node */
  const visit = (node) => {
    if (isReact && currentSourceFile?.fileName) {
      if (isReactFunctionComponent(node)) {
        addComponentType(COMPONENT_TYPE.REACT_FUNCTION);
      }

      if (isReactClassComponent(node)) {
        addComponentType(COMPONENT_TYPE.REACT_CLASS);
      }
    }

    if (isVue && currentSourceFile?.fileName) {
      if (isVueJSX(node)) {
        addComponentType(COMPONENT_TYPE.VUE_JSX);
      }

      if (isVueOptionAPI(node)) {
        addComponentType(COMPONENT_TYPE.VUE_OPTION);
      }

      if (isVueClassAPI(node)) {
        addComponentType(COMPONENT_TYPE.VUE_CLASS);
      }

      if (isVueCompositionAPI(node)) {
        addComponentType(COMPONENT_TYPE.VUE_COMPOSITION);
      }
    }

    ts.forEachChild(node, visit);
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
