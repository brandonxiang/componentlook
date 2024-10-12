


import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';

const targetCode = `
import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 'MyComponent',
  render() {
    return <div>Hello World</div>;
  }
});
`;

const normalCode = `
class AnotherClass {
  doSomething() {
    // Not a React component
  }
}
`

test('judge vue jsx api', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(componentScanner(sourceFile), true);
});

test('judge normal code', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(componentScanner(sourceFile), false);
});

test.run();