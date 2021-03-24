import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import MuseUI from 'muse-ui'
import axios from 'axios'
import 'muse-ui/dist/muse-ui.css'
import theme from './plugs/theme'
import './assets/css/main.scss'
import { mapActions } from 'vuex'
import mavonEditor from 'mavon-editor'
const hljs = require('highlight.js')
Vue.config.productionTip = false
Vue.use(theme)
Vue.prototype.$http = axios
Vue.prototype.$message = mapActions(['setMessage']).setMessage

mavonEditor.markdownIt.set({
    highlight: function (str, lang) {
        if (lang) {
            return (
                `<pre class="lang-${lang}"><svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg><code>` +
                hljs.highlight(lang, str, true).value +
                '</code></pre>'
            )
        } else {
            return (
                '<pre class="lang"><svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg><code>' +
                mavonEditor.markdownIt.utils.escapeHtml(str) +
                '</code></pre>'
            )
        }
    }
})
Vue.use(mavonEditor)
Vue.use(MuseUI)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
