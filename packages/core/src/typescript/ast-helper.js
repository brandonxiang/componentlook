/**
 * Checks if the given file extension is a declaration file extension.
 *
 * @param {string} extension - The file extension to check.
 * @return {boolean} Returns true if the extension is a declaration file extension, false otherwise.
 */
export const isDeclarationFileExtension = (extension) =>
  extension === '.d.ts' || extension === '.d.mts' || extension === '.d.cts';