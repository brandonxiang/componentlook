import { COMPONENT_TYPE } from "../constant/index.js";
import path from 'path';

/**
 *
 * @param {Map<string, string>} cache
 */
export function convertResult(cache) {
  const reactFunctionFileList = [];
  const reactClassFileList = [];
  const vueOptionFileList = [];
  const vueCompositionFileList = [];
  const vueClassFileList = [];
  const vueJsxFileList = [];

  for (const [key, value] of cache) {
    if (value === COMPONENT_TYPE.REACT_FUNCTION) {
      reactFunctionFileList.push(key);
    }
    if (value === COMPONENT_TYPE.REACT_CLASS) {
      reactClassFileList.push(key);
    }
    if (value === COMPONENT_TYPE.VUE_OPTION) {
      vueOptionFileList.push(key);
    }
    if (value === COMPONENT_TYPE.VUE_COMPOSITION) {
      vueCompositionFileList.push(key);
    }
    if (value === COMPONENT_TYPE.VUE_CLASS) {
      vueClassFileList.push(key);
    }
    if (value === COMPONENT_TYPE.VUE_JSX) {
      vueJsxFileList.push(key);
    }
  }
  return {
    reactFunctionFileList,
    reactClassFileList,
    vueOptionFileList,
    vueCompositionFileList,
    vueClassFileList,
    vueJsxFileList,
  };
}


/**
 *
 * @param {Map<string, string>} cache
 */
export function printResult(cache) {
  const {
      reactFunctionFileList,
      reactClassFileList,
      vueOptionFileList,
      vueCompositionFileList,
      vueClassFileList,
      vueJsxFileList,
  } = convertResult(cache);

  if (reactFunctionFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.REACT_FUNCTION}(${reactFunctionFileList.length}):`
    );
    reactFunctionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
  if (reactClassFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.REACT_CLASS}(${reactClassFileList.length}):`);
    reactClassFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
  if (vueOptionFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.VUE_OPTION}(${vueOptionFileList.length}):`);
    vueOptionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
  if (vueCompositionFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.VUE_COMPOSITION}(${vueCompositionFileList.length}):`
    );
    vueCompositionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
  if (vueClassFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.VUE_CLASS}(${vueClassFileList.length}):`
    );
    vueClassFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
  if (vueJsxFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.VUE_JSX}(${vueJsxFileList.length}):`
    );
    vueJsxFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\n");
  }
}

export const isAbsolute = path.isAbsolute;

export const isInNodeModules = (filePath) => filePath.includes('node_modules');

export const isInternal = (id) => (id.startsWith('.') || isAbsolute(id)) && !isInNodeModules(id);
