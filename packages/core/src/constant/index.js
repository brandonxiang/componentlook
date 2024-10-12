import ts from "typescript";

export const COMPONENT_TYPE = {
  REACT_FUNCTION: 'React Function Component',
  REACT_CLASS: 'React Class Component',
  VUE_JSX: 'Vue JSX API',
  VUE_OPTION: 'Vue Option API',
  VUE_CLASS: 'Vue Class API',
  VUE_COMPOSITION: 'Vue Composition API',
}

export const FOREIGN_FILE_EXTENSIONS = new Set([
  '.avif',
  '.css',
  '.eot',
  '.gif',
  '.html',
  '.ico',
  '.jpeg',
  '.jpg',
  '.less',
  '.mp3',
  '.png',
  '.sass',
  '.scss',
  '.sh',
  '.svg',
  '.ttf',
  '.webp',
  '.woff',
  '.woff2',
  '.yaml',
  '.yml',
]);

export const baseCompilerOptions = {
  allowJs: true,
  allowSyntheticDefaultImports: true,
  declaration: false,
  declarationMap: false,
  esModuleInterop: true,
  inlineSourceMap: false,
  inlineSources: false,
  jsx: ts.JsxEmit.Preserve,
  jsxImportSource: undefined,
  lib: [],
  types: ['node'],
  noEmit: true,
  skipDefaultLibCheck: true,
  skipLibCheck: true,
  sourceMap: false,
  allowNonTsExtensions: true,
};

export const DEFAULT_EXTENSIONS = ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.mts', '.cts'];