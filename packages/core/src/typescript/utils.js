/**
 * 
 * @param {string} filePath 
 * @returns 
 */
function toRealFilePath(filePath) {
  return filePath.slice(0, -'.ts'.length);
}

/**
 * 
 * @param {string} filePath 
 * @param {string[]} extensions 
 * @returns 
 */
export function isVirtualFilePath(filePath, extensions) {
  return extensions.some(extension => filePath.endsWith(`${extension}.ts`));
}

/**
 * 
 * @param {string} filePath 
 * @param {string[]} extensions 
 * @returns 
 */
export function ensureRealFilePath(filePath, extensions) {
  return isVirtualFilePath(filePath, extensions) ? toRealFilePath(filePath) : filePath;
}