import ts from 'typescript';
import { extname } from 'path';
import { FOREIGN_FILE_EXTENSIONS } from '../constant/index.js';
import { isInNodeModules, isInternal } from '../utils/index.js';
import { isDeclarationFileExtension } from './ast-helper.js';
import { scriptCompilers } from '../compiler/index.js';



export class SourceFileManager {

  /**
   * 
   * @type {Map<string, ts.SourceFile>}
   */
  sourceFileCache = new Map();

  constructor() {

  }

  /**
   * 
   * @param {string} filePath 
   * @param {string} contents 
   * @returns 
   */
  createSourceFile(filePath, contents) {
    const setParentNodes = isInternal(filePath);
    const sourceFile = ts.createSourceFile(filePath, contents, ts.ScriptTarget.Latest, setParentNodes);
    this.sourceFileCache.set(filePath, sourceFile);
    return sourceFile;
  }

  /**
   * 
   * @param {string} filePath 
   * @returns 
   */
  getSourceFile(filePath) {
    if (this.sourceFileCache.has(filePath)) return this.sourceFileCache.get(filePath);
    const ext = extname(filePath);
    const compiler = scriptCompilers.get(ext);
    if (FOREIGN_FILE_EXTENSIONS.has(ext) && !compiler) return undefined;

    if ( isInNodeModules(filePath)) {
      if (isDeclarationFileExtension(ext)) return undefined;
      return this.createSourceFile(filePath, '');
    }
    const contents = ts.sys.readFile(filePath);
    if (typeof contents !== 'string') {
      // if (isInternal(filePath)) debugLog('*', `Unable to read ${filePath}`);
      return this.createSourceFile(filePath, '');
    }

    const compiled = compiler ? compiler(contents) : contents;
    return this.createSourceFile(filePath, compiled);
  }
}