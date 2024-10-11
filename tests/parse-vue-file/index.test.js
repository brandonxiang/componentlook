import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { convertResult, parse, projectScanner } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('fixtures/vue/src/main.ts');

const tsconfig = path.resolve('fixtures/vue/tsconfig.json');
const packageJson = path.resolve('fixtures/vue/package.json');


test('parse react project', async () => {
  const temp = await projectScanner([entry], { tsconfig, packageJson });
  const res1 = convertResult(temp);
  assert.equal(res1.vueOptionFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/vue/src/Book.vue'
  ]);
  assert.equal(res1.vueCompositionFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/vue/src/Head.vue'
  ]);
  assert.equal(res1.vueClassFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/vue/src/Foot.vue'
  ]);
  assert.equal(res1.vueJsxFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/vue/src/Button.tsx'
  ]);
});

test.run();