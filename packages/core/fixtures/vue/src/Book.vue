<script>
import Head from './Head.vue';
import Foot from './Foot.vue';
import Button from './Button.tsx';

export default {
  data() {
    return {
      count: 0
    };
  },
  components:{
    Head,
    Foot,
    Button,
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
</script>

<template>
  <Head></Head>
  <Foot></Foot>
  <Button></Button>
</template>