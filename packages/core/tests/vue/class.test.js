import ts from 'typescript';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { componentScanner } from '../../src/index.js';
import { COMPONENT_TYPE } from '../../src/constant/index.js';

const targetCode = `
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyComponent extends Vue {
  count = 0;

  increment() {
    this.count++;
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

test('judge vue class component', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', targetCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), COMPONENT_TYPE.VUE_CLASS);
});

test('judge normal code', () => {
  const sourceFile = ts.createSourceFile('MyComponent.vue', normalCode, ts.ScriptTarget.Latest, true);
  assert.equal(componentScanner(sourceFile), '');
});

test.run();
