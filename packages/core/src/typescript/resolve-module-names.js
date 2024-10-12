import ts from 'typescript';
import { DEFAULT_EXTENSIONS } from '../constant/index.js';
import resolve from 'resolve';
import { sanitizeSpecifier } from '../utils/module.js';
import { isBuiltin } from 'node:module';
import { isInNodeModules, isInternal } from '../utils/index.js';
import { toPosix, extname, isAbsolute, dirname, join } from '../utils/path.js';
import { isDeclarationFileExtension } from './ast-helper.js';
import { ensureRealFilePath, isVirtualFilePath } from './utils.js';
import { existsSync } from 'node:fs';

/**
 * Check if a file exists and return information about the file if it does.
 *
 * @param {string} name - the name of the file to check
 * @param {string} containingFile - the name of the file containing the file to check
 * @return {object} information about the file if it exists, otherwise undefined
 */
const fileExists = (name, containingFile) => {
  const resolvedFileName = isAbsolute(name) ? name : join(dirname(containingFile), name);
  if (existsSync(resolvedFileName)) {
    return {
      resolvedFileName,
      extension: extname(name),
      isExternalLibraryImport: false,
      resolvedUsingTsExtension: false,
    };
  }
};

/**
 * @type {Map<string, ts.ResolvedModuleFull | undefined>}
 */
const resolutionCache = new Map();

/**
 * Generates a custom module resolver for TypeScript.
 *
 * @param {typeof ts.sys} customSys - The custom system object.
 * @param {ts.CompilerOptions} compilerOptions - The TypeScript compiler options.
 * @param {string[]} virtualFileExtensions - The virtual file extensions.
 * @return {*} An array of resolved module objects or undefined.
 */
export function createCustomModuleResolver(
  customSys,
  compilerOptions,
  virtualFileExtensions
) {
  const extensions = [...DEFAULT_EXTENSIONS, ...virtualFileExtensions];

  /**
   * 
   * @param {string[]} moduleNames 
   * @param {string} containingFile 
   * @returns {Array<ts.ResolvedModuleFull | undefined>}
   */
  function resolveModuleNames(moduleNames, containingFile) {

    return moduleNames.map(moduleName => {
      const key = moduleName.startsWith('.')
        ? join(dirname(containingFile), moduleName)
        : `${containingFile}:${moduleName}`;
      if (resolutionCache.has(key)) return resolutionCache.get(key);
      const resolvedModule = resolveModuleName(moduleName, containingFile);
      resolutionCache.set(key, resolvedModule);
      return resolvedModule;
    });
  }

  /**
   * Resolve the module name to a full resolved module.
   *
   * @param {string} name - the module name to resolve
   * @param {string} containingFile - the file containing the module name
   * @return {ts.ResolvedModuleFull | undefined} the resolved module or undefined if not found
   */
  function resolveModuleName(name, containingFile) {

    const sanitizedSpecifier = sanitizeSpecifier(name);

    // No need to try and resolve builtins or externals, bail out
    if (isBuiltin(sanitizedSpecifier) || isInNodeModules(name)) return undefined;

    try {
      const resolved = resolve.sync(sanitizedSpecifier, {
        basedir: dirname(containingFile),
        extensions,
        preserveSymlinks: false,
      });

      const resolvedFileName = toPosix(resolved);
      const ext = extname(resolved);
      const extension = virtualFileExtensions.includes(ext) ? ts.Extension.Js : ext;

      return {
        resolvedFileName,
        extension,
        isExternalLibraryImport: isInNodeModules(resolvedFileName),
        resolvedUsingTsExtension: false,
      };
    } catch (err) {
      // Intentional slip-through, plenty of cases left in TS context
    }

    const tsResolvedModule = ts.resolveModuleName(
      sanitizedSpecifier,
      containingFile,
      compilerOptions,
      ts.sys
    ).resolvedModule;

    if (
      tsResolvedModule &&
      isDeclarationFileExtension(tsResolvedModule.extension) &&
      isInternal(tsResolvedModule.resolvedFileName)
    ) {
      if (tsResolvedModule.extension === '.d.mts') {
        const resolvedFileName = tsResolvedModule.resolvedFileName.replace(/\.d\.mts$/, '.mjs');
        return { resolvedFileName, extension: '.mjs', isExternalLibraryImport: false, resolvedUsingTsExtension: false };
      }

      if (tsResolvedModule.extension === '.d.cts') {
        const resolvedFileName = tsResolvedModule.resolvedFileName.replace(/\.d\.cts$/, '.cjs');
        return { resolvedFileName, extension: '.cjs', isExternalLibraryImport: false, resolvedUsingTsExtension: false };
      }

      const base = tsResolvedModule.resolvedFileName.replace(/\.d\.ts$/, '');
      const baseExt = extname(base);

      if (baseExt && virtualFileExtensions.includes(baseExt)) {
        const resolvedFileName = ensureRealFilePath(base, virtualFileExtensions);
        return {
          resolvedFileName,
          extension: ts.Extension.Js,
          isExternalLibraryImport: false,
          resolvedUsingTsExtension: false,
        };
      }

      for (const ext of ['.js', '.jsx']) {
        const module = fileExists(base + ext, containingFile);
        if (module) return module;
      }

      return tsResolvedModule;
    }

    if (tsResolvedModule && !isVirtualFilePath(tsResolvedModule.resolvedFileName, virtualFileExtensions)) {
      return tsResolvedModule;
    }

    const customResolvedModule = ts.resolveModuleName(
      sanitizedSpecifier,
      containingFile,
      compilerOptions,
      customSys
    ).resolvedModule;

    if (!(customResolvedModule && isVirtualFilePath(customResolvedModule.resolvedFileName, virtualFileExtensions))) {
      const module = fileExists(sanitizedSpecifier, containingFile);
      if (module) return module;
      return customResolvedModule;
    }

    const resolvedFileName = ensureRealFilePath(customResolvedModule.resolvedFileName, virtualFileExtensions);

    /** @type {ts.ResolvedModuleFull}  */
    const resolvedModule = {
      extension: ts.Extension.Js,
      resolvedFileName,
      isExternalLibraryImport: customResolvedModule.isExternalLibraryImport,
    };

    return resolvedModule;
  }

  return resolveModuleNames;
}