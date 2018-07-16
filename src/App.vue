<template>
  <div id="app">
    <left-nav @showSetting="$refs.setting.show()"></left-nav>
    <router-view class="content"/>
    <message></message>
    <loading></loading>
    <setting ref="setting"></setting>
  </div>
</template>
<script>
import LeftNav from './components/LeftNav.vue'
import Message from './components/Message'
import Loading from './components/Loading'
import Setting from './components/Setting'
import { mapActions } from 'vuex'
export default {
    components: {
        LeftNav,
        Message,
        Loading,
        Setting
    },
    methods: {
        ...mapActions(['getListPost'])
    },
    mounted() {
        this.getListPost()
    }
};</script>

<style lang="scss">
.content {
    margin-left: 69px;
}
</style>
