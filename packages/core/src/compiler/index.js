import { importsWithinScripts as vueCompiler, getScripts} from '../compiler/vue.js';

export const compilers = new Map([['.vue', vueCompiler],]);

export const scriptCompilers = new Map([['.vue', getScripts]]);

export const getCompilerExtensions = (compilers) => [
  ...compilers.keys(),
]