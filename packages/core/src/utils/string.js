import fs from 'fs';

/**
 * 
 * @param {string} path 
 * @returns 
 */
export function readJson(path) {
  const jsonString = fs.readFileSync(path, 'utf8');

  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (jsonError) {
    try {
        const jsonWithoutComments = jsonString.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
        const data = JSON.parse(jsonWithoutComments);
        return data;
    } catch (error) {
      console.log('json parse error:', jsonError);
      console.log('json without comments error:', error);
      return {};
    }
  }
}

/**
 * 
 * @param {*} packageJson 
 */
export function getDependencies (packageJson) {
  const { devDependencies, dependencies } = packageJson;
  const allDependencies = new Set([
    ...Object.keys(devDependencies || {}),
    ...Object.keys(dependencies || {}),
  ]);
  return allDependencies;
}