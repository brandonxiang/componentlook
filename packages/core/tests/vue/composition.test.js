import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';
import { COMPONENT_TYPE } from '../../src/constant/index.js';

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

const nonVueImportCode = `
import { reactive } from 'state-lib';

const state = reactive({ count: 0 });
`

test('judge vue composition API', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), COMPONENT_TYPE.VUE_COMPOSITION);
});

test('judge normal code', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), '');
});

test('does not classify composition-like calls from non-vue imports', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', nonVueImportCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), '');
});

test.run();
