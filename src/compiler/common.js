const scriptExtractor = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
export const importMatcher = /import[^'"]+['"].+['"]/g;

/**
 * Extracts imports from the given text and returns them joined by a semicolon and newline.
 *
 * @param {string} text - The text to extract imports from
 * @return {string} The joined imports
 */
export const importsWithinScripts = (text) => {
  const scripts = [];
  let scriptMatch;
  // biome-ignore lint/suspicious/noAssignInExpressions: ignore
  while ((scriptMatch = scriptExtractor.exec(text))) {
    for (const importMatch of scriptMatch[1].matchAll(importMatcher)) {
      scripts.push(importMatch);
    }
  }
  return scripts.join(';\n');
};

export const getScripts = (text) => {
  let scriptMatch;

  while ((scriptMatch = scriptExtractor.exec(text))) {
    if(scriptMatch[1]) {
      return scriptMatch[1];
    }
  }
  return text;
}