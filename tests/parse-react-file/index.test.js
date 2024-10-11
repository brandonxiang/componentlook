


import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { convertResult, projectScanner } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('fixtures/react/src/index.tsx');
const tsconfig = path.resolve('fixtures/react/tsconfig.json');
const packageJson = path.resolve('fixtures/react/package.json');

test('parse react project', async () => {
  const temp = await projectScanner([entry], { tsconfig, packageJson });
  const res1 = convertResult(temp);
  assert.equal(res1.reactFunctionFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/react/src/head.tsx',
    '/Users/weipingxiang/github/componentlook/fixtures/react/src/foot.tsx'
  ]);
  assert.equal(res1.reactClassFileList, [
    '/Users/weipingxiang/github/componentlook/fixtures/react/src/index.tsx'
  ]);
});

test.run();

