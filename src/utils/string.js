import fs from 'fs';

/**
 * 
 * @param {string} path 
 * @returns 
 */
export function readJson(path) {
  const jsonString = fs.readFileSync(path, 'utf8');
  const jsonWithoutComments = jsonString.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
  try {
    const data = JSON.parse(jsonWithoutComments);
    return data;
  } catch (error) {
    console.log(error);
    return {};
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