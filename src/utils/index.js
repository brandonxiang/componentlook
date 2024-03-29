import { COMPONENT_TYPE } from "../constant/index.js";
import fs from 'fs';

/**
 *
 * @param {Map<string, string>} cache
 */
export function printResult(cache) {
  const reactFunctionFileList = [];
  const reactClassFileList = [];
  const vueOptionFileList = [];
  const vueCompositionFileList = [];
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
  }
  if (reactFunctionFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.REACT_FUNCTION}(${reactFunctionFileList.length}):`
    );
    reactFunctionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\r\n");
  }
  if (reactClassFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.REACT_CLASS}(${reactClassFileList.length}):`);
    reactClassFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\r\n");
  }
  if (vueOptionFileList.length > 0) {
    console.log(`${COMPONENT_TYPE.VUE_OPTION}(${vueOptionFileList.length}):`);
    vueOptionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\r\n");
  }
  if (vueCompositionFileList.length > 0) {
    console.log(
      `${COMPONENT_TYPE.VUE_COMPOSITION}(${vueCompositionFileList.length}):`
    );
    vueCompositionFileList.forEach((item) => {
      console.log(item);
    });
    console.log("\r\n");
  }
}

/**
 * 
 * @param {string} path 
 * @returns 
 */
export function readJson(path) {
  const jsonString = fs.readFileSync(path, 'utf8');
  const jsonWithoutComments = jsonString.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
  const data = JSON.parse(jsonWithoutComments);

  return data;
}