import ts from 'typescript';
import { isReactFunctionComponent } from './react/functionComponent.js';
import { isReactClassComponent } from './react/classComponent.js';
import { isVueClassAPI } from './vue/class.js';
import { isVueJSX } from './vue/jsx.js';
import { isVueCompositionAPI } from './vue/composition.js';
import { isVueOptionAPI } from './vue/option.js';
import { COMPONENT_TYPE } from './constant/index.js';

/**
 * 
 * @param {Map<string, string>} cache 
 */
function printResult (cache) {
  const reactFunctionFileList = [];
  const reactClassFileList = [];
  const vueOptionFileList = [];
  const vueCompositionFileList = [];
  for (const [key, value] of cache) {
    if(value === COMPONENT_TYPE.REACT_FUNCTION) {
      reactFunctionFileList.push(key);
    }
    if(value === COMPONENT_TYPE.REACT_CLASS) {
      reactClassFileList.push(key);
    }
    if(value === COMPONENT_TYPE.VUE_OPTION) {
      vueOptionFileList.push(key);
    }
    if(value === COMPONENT_TYPE.VUE_COMPOSITION) {
      vueCompositionFileList.push(key);
    }
  }
  if(reactFunctionFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.REACT_FUNCTION}(${reactFunctionFileList.length}):`);
    reactFunctionFileList.forEach((item) => {
      console.log(item);
    })
    console.log('\r\n');
  }
  if(reactClassFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.REACT_CLASS}(${reactClassFileList.length}):`);
    reactClassFileList.forEach((item) => {
      console.log(item);
    })
    console.log('\r\n');
  }
  if(vueOptionFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.VUE_OPTION}(${vueOptionFileList.length}):`);
    vueOptionFileList.forEach((item) => {
      console.log(item);
    })
    console.log('\r\n');
  }
  if(vueCompositionFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.VUE_COMPOSITION}(${vueCompositionFileList.length}):`);
    vueCompositionFileList.forEach((item) => {
      console.log(item);
    })
    console.log('\r\n');
  }
}

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
      console.log('is React Function Component');
      containsJsxElement = true;
    }

    if(isReactClassComponent(node)) {
      console.log('is React Class Component');
      containsJsxElement = true;
    }

    // if(isVueJSX(node)) {
    //   console.log('is Vue JSX API');
    //   containsJsxElement = true;
    // }

    if(isVueClassAPI(node)) {
      console.log('is Vue Class API');
      containsJsxElement = true;
    }

    if(isVueCompositionAPI(node)) {
      console.log('is Vue Composition API');
      containsJsxElement = true;
    }

    if(isVueOptionAPI(node)) {
      console.log('is Vue Option API');
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
 * @param {string[]} entry 
 * @returns 
 */
export function parse(entry) { 
  let cache = new Map();
  /**
   * 
   * @type {ts.SourceFile | null}
   */
  let currentSourceFile = null;
  /**
   * 
   * @param {ts.Node} node 
   */
 const visit = (node) => {
  console.log(node);

  if (isReactFunctionComponent(node)) {
    cache.set(currentSourceFile?.fileName,  COMPONENT_TYPE.REACT_FUNCTION);
  }
  
  if(isReactClassComponent(node)) {
    cache.set(currentSourceFile?.fileName,  COMPONENT_TYPE.REACT_CLASS);
  }

  // if(isVueJSX(node)) {
  //   console.log(currentSourceFile?.fileName, 'is Vue JSX API');
  //   cache.set(currentSourceFile?.fileName,  'is Vue JSX API');
  // }

  if(isVueOptionAPI(node)) {
    cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.VUE_OPTION);
  }

  // if(isVueClassAPI(node)) {
  //   cache.set(currentSourceFile?.fileName,  COMPONENT_TYPE.VUE_CLASS);
  // }

  if(isVueCompositionAPI(node)) {
    cache.set(currentSourceFile?.fileName, COMPONENT_TYPE.VUE_COMPOSITION);
  }



  if (!cache.get(currentSourceFile?.fileName)) {
    ts.forEachChild(node, visit);
  }
 }

 console.log(entry);
  const program = ts.createProgram(entry, {});

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('node_modules')
    );
  });

  console.log(sourceFiles);

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    ts.forEachChild(sourceFile, visit);
  });

  console.log(cache);

  printResult(cache);
}