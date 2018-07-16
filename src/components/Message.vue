<template>
<div>
    <mu-snackbar :color="color.color" :open.sync="color.open" position="top-end">
        <svg class="icon pre-icon" aria-hidden="true">
            <use :xlink:href="icon"></use>
        </svg>
            {{color.message}}
        <mu-button style="width: inherit; height: inherit;" icon slot="action" color="#fff" @click="color.open = false">
             <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shanchu"></use>
            </svg>
        </mu-button>
  </mu-snackbar>
</div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      colors: ["success", "info", "error", "warning"],
      color: {
        color: "success",
        message: "Hello World, Snackbar !",
        open: false,
        timeout: 3000
      }
    };
  },
  computed: {
    ...mapState({
      message: ({ sys }) => sys.message
    }),
    icon() {
      return {
        success: "#icon-success",
        info: "#icon-info",
        warning: "#icon-warning",
        error: "#icon-iconfberror"
      }[this.color.color];
    }
  },
  methods: {
    showMsg(type, msg) {
      if (this.color.timer) clearTimeout(this.color.timer);
      this.color.color = type;
      this.color.message = msg;
      this.color.open = true;
      this.color.timer = setTimeout(() => {
        this.color.open = false;
      }, this.color.timeout);
    }
  },
  watch: {
    message: {
      handler: function(v) {
        this.showMsg(v.type, v.message);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.icon {
  font-size: 1rem;
}
.pre-icon {
  margin-right: 10px;
  font-size: 1.6rem;
  color: #fff;
}
</style>
