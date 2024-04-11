import ts from "typescript";
import { SourceFileManager } from "./source-file-manager.js";
import { compilers, getCompilerExtensions } from "../compiler/index.js";
import { FOREIGN_FILE_EXTENSIONS } from "../constant/index.js";
import { createCustomSys } from "./sys.js";
import { createCustomModuleResolver } from "./resolve-module-names.js";
import path from "node:path";
import { EOL } from 'node:os';

const libLocation = path.dirname(ts.getDefaultLibFilePath({}));

/**
 * 
 * @param {*} compilerOptions 
 * @returns {ts.CompilerHost}
 */
export function createHost ({ cwd, compilerOptions }) {
  const fileManager = new SourceFileManager();
  const compilerExtensions = getCompilerExtensions(compilers);
  // const compilerHost = ts.createCompilerHost(compilerOptions);
  const sys = createCustomSys([...compilerExtensions, ...FOREIGN_FILE_EXTENSIONS]);

  const resolveModuleNames = createCustomModuleResolver(sys, compilerOptions, compilerExtensions);

  const compilerHost = {
    writeFile: () => undefined,
    getDefaultLibLocation: () => libLocation,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    getSourceFile: (fileName) => fileManager.getSourceFile(fileName),
    getCurrentDirectory: sys.getCurrentDirectory,
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => EOL,
    readFile: sys.readFile,
    fileExists: sys.fileExists,
    resolveModuleNames: resolveModuleNames,
  }

  return compilerHost
}