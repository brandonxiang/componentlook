

import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';

const reactFunctionCode = `
import React from 'react';

export default function MyComponent() {
  return <div>Hello, World!</div>;
}
`;

const normalCode = `
function nonComponent() {
  return Math.random();
}
`; 

test('judge react function component', () => {
  const sourceFile = ts.createSourceFile('MyComponent.tsx', reactFunctionCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), true);
});

test('judge normal function', () => {
  const sourceFile = ts.createSourceFile('MyComponent.tsx', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), false);
});

test.run();