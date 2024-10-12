<script>
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
</script>

<template>
  <div>Head</div>
</template>