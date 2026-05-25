import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'path';

const packageJson = JSON.parse(
  readFileSync(path.resolve('package.json'), 'utf8')
);

test('prints the package version', () => {
  const output = execFileSync(
    process.execPath,
    [path.resolve('bin.js'), '--version'],
    { encoding: 'utf8' }
  ).trim();

  assert.equal(output, `componentlook, ${packageJson.version}`);
});

test.run();
