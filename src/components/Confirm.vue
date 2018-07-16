<template>
    <mu-dialog :title="title" width="400" max-width="80%" :esc-press-close="true" :overlay-close="false" :open.sync="openAlert">
    {{content}}
    <mu-button slot="actions" flat @click="clickBtn(false)">{{btnCancel}}</mu-button>
    <mu-button slot="actions" flat color="primary" @click="clickBtn(true)">{{btnConfirm}}</mu-button>
  </mu-dialog>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      content: "",
      btnCancel: "取消",
      btnConfirm: "确认",
      openAlert: false,
      flag: false,
      callback: function() {}
    };
  },
  methods: {
    show(opt, cb) {
      this.title = opt.title || "消息确认";
      this.content = opt.content;
      opt.cancelBtnText ? (this.btnCancel = opt.cancelBtnText) : "";
      opt.confirmBtnText ? (this.btnConfirm = opt.confirmBtnText) : "";
      cb ? (this.callback = cb) : "";
      this.openAlert = true;
    },
    clickBtn(flag) {
      this.flag = flag;
      this.openAlert = false;
      this.callback(flag);
    }
  }
};
</script>
