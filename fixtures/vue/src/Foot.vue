<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyComponent extends Vue {
  count = 0;

  increment() {
    this.count++;
  }
}
</script>