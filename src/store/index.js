import Vue from "vue";
import Vuex from "vuex";
const isElectron = typeof window.require === "function";
Vue.use(Vuex);
const files = require.context("./modules", false, /\.js$/);
const modules = {};
files.keys().forEach(key => {
  if (!key.startsWith("./_")) {
    modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
  } else if (isElectron) {
    modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
  }
});

export default new Vuex.Store({
  modules
});
