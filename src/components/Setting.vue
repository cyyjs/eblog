<template>
    <mu-dialog title="系统设置" width="360" :open.sync="open">
        <mu-form :model="setting" class="mu-demo-form" label-position="left" label-width="100">
            <mu-form-item prop="theme" label="系统主题">
                <div class="theme-list">
                    <mu-ripple :key="theme.name" v-for="theme in $themeList" @click.native="selectTheme(theme.name)" :class="['theme-item', setting.theme == theme.name?'active':'']" :style="{backgroundColor:theme.color}" :opacity="0.7">
                    </mu-ripple>
                </div>
            </mu-form-item>
            <mu-form-item prop="select" label="编辑器样式">
            <mu-select v-model="setting.codeStyle" @change="changeSetting">
                <mu-option v-for="style in codeStyleList" :key="style" :label="style" :value="style"></mu-option>
            </mu-select>
            </mu-form-item>
        </mu-form>
    <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
  </mu-dialog>
</template>
<script>
import codeStyleList from "../dictionary/codestyle.js";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      codeStyleList,
      open: false,
      setting: {}
    };
  },
  computed: {
    ...mapState({
      _setting: ({ sys }) => sys.setting
    })
  },
  methods: {
    ...mapActions(["setSetting"]),
    show() {
      this.open = true;
    },
    closeSimpleDialog() {
      this.open = false;
    },
    selectTheme(n) {
      this.setting.theme = n;
      this.$theme.use(n);
      this.changeSetting();
    },
    changeSetting() {
      this.setSetting(this.setting);
    }
  },
  mounted() {
    this.$theme.use(this._setting.theme);
    this.setting = { ...this._setting };
  }
};
</script>
<style lang="scss" scoped>
.theme-item {
  width: 45px;
  height: 45px;
  position: relative;
  flex-shrink: 0;
  border: 1px solid #fff;
  &.active:after {
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 15px;
    position: absolute;
    right: 0;
    top: 0;
  }
}
.theme-list {
  width: 180px;
  display: flex;
  flex-wrap: wrap;
}
</style>
