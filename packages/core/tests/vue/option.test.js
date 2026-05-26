import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';
import { COMPONENT_TYPE } from '../../src/constant/index.js';

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

const nonComponentObjectCode = `
const tableConfig = {
  data: [],
  methods: {}
}
`;

test('judge vue option api', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), COMPONENT_TYPE.VUE_OPTION);
});

test('judge normal object', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), '');
});

test('does not classify arbitrary objects with option-like keys', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', nonComponentObjectCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), '');
});

test.run();
