import { isBuiltin } from "module";
import { isAbsolute } from "path";

/**
 * Strip `?search` and other proprietary directives from the specifier (e.g. https://webpack.js.org/concepts/loaders/)
 * @param {string} specifier 
 * @returns 
 */
export const sanitizeSpecifier = (specifier) => {
  if (isBuiltin(specifier)) return specifier;
  if (isAbsolute(specifier)) return specifier;
  if (specifier.startsWith('virtual:')) return specifier;
  return specifier.replace(/^([?!|-]+)?([^!?:]+).*/, '$2');
};