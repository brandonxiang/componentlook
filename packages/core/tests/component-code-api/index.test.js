import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  COMPONENT_TYPE,
  detectComponentType,
  isComponentType
} from '../../src/index.js';

const reactFunctionCode = `
import React from 'react';

export function ProfileCard() {
  return <section>Profile</section>;
}
`;

const vueCompositionCode = `
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({ count: 0 });
    return { state };
  }
}
`;

const plainCode = `
export function add(a, b) {
  return a + b;
}
`;

test('detects a component type from file content', () => {
  assert.equal(
    detectComponentType(reactFunctionCode, { fileName: 'ProfileCard.tsx' }),
    COMPONENT_TYPE.REACT_FUNCTION
  );
});

test('checks whether file content matches the requested component type', () => {
  assert.is(
    isComponentType(COMPONENT_TYPE.VUE_COMPOSITION, vueCompositionCode, { fileName: 'ProfileCard.vue' }),
    true
  );
});

test('returns false when file content does not match the requested component type', () => {
  assert.is(
    isComponentType(COMPONENT_TYPE.REACT_CLASS, reactFunctionCode, { fileName: 'ProfileCard.tsx' }),
    false
  );
});

test('returns an empty component type for non-component file content', () => {
  assert.equal(detectComponentType(plainCode, { fileName: 'math.ts' }), '');
});

test.run();
