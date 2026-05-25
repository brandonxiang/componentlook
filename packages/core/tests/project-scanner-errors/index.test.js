import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { projectScanner } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('fixtures/react/src/index.tsx');
const tsconfig = path.resolve('fixtures/react/tsconfig.json');
const packageJson = path.resolve('fixtures/react/package.json');

async function expectScannerError(promise, code) {
  try {
    await promise;
    assert.unreachable('Expected projectScanner to reject');
  } catch (error) {
    assert.equal(error.code, code);
  }
}

test('throws for missing entry files', async () => {
  await expectScannerError(
    projectScanner([path.resolve('fixtures/react/src/missing.tsx')], { tsconfig, packageJson }),
    'ENTRY_NOT_FOUND'
  );
});

test('throws for missing package.json', async () => {
  await expectScannerError(
    projectScanner([entry], { tsconfig, packageJson: path.resolve('fixtures/react/missing-package.json') }),
    'PACKAGE_JSON_NOT_FOUND'
  );
});

test('throws for missing tsconfig.json', async () => {
  await expectScannerError(
    projectScanner([entry], { tsconfig: path.resolve('fixtures/react/missing-tsconfig.json'), packageJson }),
    'TSCONFIG_NOT_FOUND'
  );
});

test.run();
