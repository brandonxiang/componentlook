


import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';

const targetCode = `
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
`;

const normalCode = `
export default {
  doSomething() {
    // Not a React component
  }
}
`

test('judge vue option api', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), true);
});

test('judge normal object', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), false);
});

test.run();