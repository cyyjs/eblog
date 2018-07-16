<template>
    <div>
        <top-head title="标签列表"></top-head>
        <div class="type-list">
            <mu-list>
                 <mu-chip class="chip" text-color="#fff" color="primary" v-for="(v, k) in tagList" :key="k" @click.native="goList(k)">
                    {{k}}
                    <mu-badge color="primary" :content="String(v)" class="icon-badge" circle/>
                </mu-chip>
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
        ...mapGetters(['tagList'])
    },
    methods: {
        ...mapActions(['setPostQuery']),
        goList(k) {
            this.setPostQuery({
                category: '全部',
                tag: k,
                status: '',
                q: ''
            })
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss" scoped>
.chip {
    margin: 8px;
}
</style>
