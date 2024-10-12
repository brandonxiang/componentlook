


import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';

const reactClassCode = `
import React, { Component } from 'react';

class MyComponent extends Component {
  render() {
    return <div>Hello, World!</div>;
  }
}

class AnotherClass {
  doSomething() {
    // Not a React component
  }
}
`;

const normalCode = `
class AnotherClass {
  doSomething() {
    // Not a React component
  }
}
`

test('judge react class component', () => {
  const sourceFile = ts.createSourceFile('MyComponent.tsx', reactClassCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), true);
});

test('judge normal class', () => {
  const sourceFile = ts.createSourceFile('MyComponent.tsx', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), false);
});

test.run();