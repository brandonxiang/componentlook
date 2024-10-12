import path from 'node:path';

/**
 * 
 * @param {string} value 
 * @returns 
 */
export const toPosix = (value) => value.split(path.sep).join(path.posix.sep);

export const isAbsolute = path.isAbsolute;
export const dirname = path.posix.dirname;
export const extname = path.posix.extname;
export const basename = path.posix.basename;
export const join = path.posix.join;