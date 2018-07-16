<template>
    <div class="loading" v-show="loading">
        <mu-circular-progress class="circ" :size="48"></mu-circular-progress>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      loading: ({ sys }) => sys.loading
    })
  }
};
</script>
<style lang="scss" scoped>
.loading {
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 2000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .circ {
    left: 50%;
    top: 40%;
  }
}
</style>
