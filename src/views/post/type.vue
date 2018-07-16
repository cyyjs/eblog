<template>
    <div class="content2">
        <top-head title="分类列表"></top-head>
        <div class="type-list">
            <mu-list>
                <mu-list-item  class="type-item" button v-for="(v, k) in typeList" :key="k" @click.native="goList(k)">
                    <mu-list-item-title>{{k}}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-badge :content="String(v)" color="primary" circle></mu-badge>
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
        </div>
    </div>
</template>
<script>
import TopHead from '../../components/Head'
import { mapGetters, mapActions } from 'vuex'
export default {
    components: {
        TopHead
    },
    computed: {
        ...mapGetters(['typeList'])
    },
    methods: {
        ...mapActions(['setPostQuery']),
        goList(k) {
            this.setPostQuery({
                category: k,
                tag: '全部',
                status: '',
                q: ''
            })
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss" scoped>
.type-list {
    .type-item {
        border-bottom: 1px solid #ddd;
    }
}
</style>
