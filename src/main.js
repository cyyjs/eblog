import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import MuseUI from "muse-ui";
import axios from "axios";
import "muse-ui/dist/muse-ui.css";
import theme from "./plugs/theme";
import "./assets/css/main.scss";
import { mapActions } from "vuex";
Vue.config.productionTip = false;
Vue.use(theme);
Vue.prototype.$http = axios;
Vue.prototype.$message = mapActions(["setMessage"]).setMessage;
Vue.prototype.$isElectron = typeof window.require === "function";

Vue.use(MuseUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
