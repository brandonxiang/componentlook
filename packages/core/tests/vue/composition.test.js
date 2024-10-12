import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';

const targetCode = `
import { ref, reactive } from 'vue';

export default {
  setup() {
    const state = reactive({ count: 0 });

    function increment() {
      state.count++;
    }

    return { state, increment };
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

test('judge vue composition API', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), true);
});

test('judge normal code', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), false);
});

test.run();