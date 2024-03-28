import ts from 'typescript';
import { isReactFunctionComponent } from './react/functionComponent.js';
import { isReactClassComponent } from './react/classComponent.js';
import { isVueClassAPI } from './vue/class.js';
import { isVueJSX } from './vue/jsx.js';
import { isVueCompositionAPI } from './vue/composition.js';
import { isVueOptionAPI } from './vue/option.js';

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

    if(isVueJSX(node)) {
      console.log('is Vue JSX API');
      containsJsxElement = true;
    }

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


  if (isReactFunctionComponent(node)) {
    console.log(currentSourceFile?.fileName, 'is React Function Component');
    cache.set(currentSourceFile?.fileName,  'React Function Component');
  }
  
  if(isReactClassComponent(node)) {
    console.log(currentSourceFile?.fileName, 'is React Class Component');
    cache.set(currentSourceFile?.fileName,  'React Class Component');
  }

  // if(isVueJSX(node)) {
  //   console.log(currentSourceFile?.fileName, 'is Vue JSX API');
  //   cache.set(currentSourceFile?.fileName,  'is Vue JSX API');
  // }

  // if(isVueOptionAPI(node)) {
  //   console.log(currentSourceFile?.fileName, 'is Vue Option API');
  //   cache.set(currentSourceFile?.fileName, 'is Vue Option API');
  // } else if(isVueClassAPI(node)) {
  //   console.log(currentSourceFile?.fileName, 'is Vue Class API');
  //   cache.set(currentSourceFile?.fileName,  'is Vue Class API');
  // } else if(isVueCompositionAPI(node)) {
  //   console.log(currentSourceFile?.fileName, 'is Vue Composition API');
  //   cache.set(currentSourceFile?.fileName, 'is Vue Composition API');
  // }



  if (!cache.get(currentSourceFile?.fileName)) {
    ts.forEachChild(node, visit);
  }
 }
  const program = ts.createProgram(entry, {
    jsx: ts.JsxEmit.ReactJSX,
  });

  const sourceFiles = program.getSourceFiles().filter((sourceFile) => {
    return (
      !sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('node_modules')
    );
  });

  sourceFiles.forEach((sourceFile) => {
    currentSourceFile = sourceFile;
    ts.forEachChild(sourceFile, visit);
  });
}