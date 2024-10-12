import ts from 'typescript';
import { ensureRealFilePath } from './utils.js';

/**
 * Creates a custom system with the given current working directory and virtual file extensions.
 *
 * @param {string[]} virtualFileExtensions - The virtual file extensions.
 * @return {*} The custom system object.
 */
export function createCustomSys(virtualFileExtensions) {
  const sys = {
    ...ts.sys,
  };

  if (virtualFileExtensions.length === 0) return sys;

  return {
    ...sys,
    fileExists(path) {
      return ts.sys.fileExists(ensureRealFilePath(path, virtualFileExtensions));
    },
  };
}