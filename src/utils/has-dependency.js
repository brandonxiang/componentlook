
/**
 * Check if any of the values in the array match the dependencies set.
 *
 * @param {Set<string>} dependencies - The set of dependencies to check against.
 * @param {Array<string | RegExp>} values - The array of values to compare against the dependencies.
 * @return {boolean} Returns true if any of the values match the dependencies, otherwise false.
 */
export const hasDependency = (dependencies, values) =>
  values.some(value => {
    if (typeof value === 'string') {
      return dependencies.has(value);
    } else if (value instanceof RegExp) {
      for (const dependency of dependencies) {
        if (value.test(dependency)) return true;
      }
    }
    return false;
  });



