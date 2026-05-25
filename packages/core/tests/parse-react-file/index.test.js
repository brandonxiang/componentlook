import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { convertResult, projectScanner } from '../../src/index.js';
import { COMPONENT_TYPE } from '../../src/constant/index.js';
import path from 'path';

const entry = path.resolve('fixtures/react/src/index.tsx');
const tsconfig = path.resolve('fixtures/react/tsconfig.json');
const packageJson = path.resolve('fixtures/react/package.json');

test('parse react project', async () => {
  const temp = await projectScanner([entry], { tsconfig, packageJson });
  const res1 = convertResult(temp);
  assert.equal(res1.reactFunctionFileList, [
    path.resolve('fixtures/react/src/head.tsx'),
    path.resolve('fixtures/react/src/foot.tsx'),
    path.resolve('fixtures/react/src/index.tsx')
  ]);
  assert.equal(res1.reactClassFileList, [
    path.resolve('fixtures/react/src/index.tsx')
  ]);
});

test('convert result preserves multiple component styles per file', () => {
  const fileName = path.resolve('fixtures/react/src/mixed.tsx');
  const res1 = convertResult(new Map([
    [fileName, new Set([COMPONENT_TYPE.REACT_FUNCTION, COMPONENT_TYPE.REACT_CLASS])]
  ]));

  assert.equal(res1.reactFunctionFileList, [fileName]);
  assert.equal(res1.reactClassFileList, [fileName]);
});

test.run();
