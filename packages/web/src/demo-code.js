export const VueOptionStyle= `
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

export const VueCompositionStyle = `
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

export const VueClassStyle = `
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyComponent extends Vue {
  count = 0;

  increment() {
    this.count++;
  }
}
`;

export const VueJsxStyle = `
import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 'MyComponent',
  render() {
    return <div>Hello World</div>;
  }
});
`;

export const ReactClassStyle = `
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

export const ReactFunctionStyle = `
import React from 'react';

export default function MyComponent() {
  return <div>Hello, World!</div>;
}
`;

export const demoCodeMap = {
  vueOptionStyle: VueOptionStyle,
  vueCompositionStyle: VueCompositionStyle,
  vueClassStyle: VueClassStyle,
  vueJsxStyle: VueJsxStyle,
  reactClassStyle: ReactClassStyle,
  reactFunctionStyle: ReactFunctionStyle,
};