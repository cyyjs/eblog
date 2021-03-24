<template>
    <div>
        <search-head 
            @export="exportFileEvent"
            @import="importFileEvent"
        ></search-head>
        <div class="post-list">
            <div class="nodata" v-if="!list.length">无数据</div>
            <div  v-if="list.length" :class="['item-list', viewclass]">
                <card :item="p" 
                    @selectItem="privewPost = $event"
                    @reload="fetchList"
                    v-for="p in list" :key="p._id"></card>
            </div>
            <div v-if="list.length" :class="['post-privew', viewclass]">
                <privew ref="privew" :post="privewPost"></privew>
            </div>
        </div>
    </div>
</template>
<script>
import SearchHead from '../../components/SearchHead'
import privew from './privew'
import Card from './card'
import { mapState, mapActions } from 'vuex'
import { exportFile, importFile} from '../../api';

let time = null
export default {
    props: {
        isTrash: Boolean
    },
    data() {
        return {
            privewPost: {}
        }
    },
    components: {
        SearchHead,
        Card,
        privew
    },
    computed: {
        ...mapState({
            page: ({ post }) => post.page,
            query: ({ post }) => post.query,
            viewType: ({ sys }) => sys.viewType
        }),
        list() {
            return this.page.data || []
        },
        viewclass() {
            return this.viewType === 2 ? 'open' : ''
        }
    },
    methods: {
        ...mapActions(['getListPost', 'setMessage', 'importPost']),
        fetchList() {
            clearTimeout(time)
            time = setTimeout(() => {
                this.fetchData()
            }, 500)
        },
        async fetchData() {
            let query = { ...this.query }
            if (this.isTrash) {
                query.status = 2
            }
            if (query.category === '全部') {
                query.category = ''
            }
            if (query.tag === '全部') {
                query.tag = ''
            }
            await this.getListPost(query)
            this.privewPost = this.list[0]
        },
        async exportFileEvent(t) {
            this.open2 = false
            const { data } = await exportFile({
                type: t,
                title: this.privewPost.title,
                mk: this.privewPost.content,
                html: this.$refs.privew.getHtml()
            })
            if (data.code === 1) {
                this.setMessage({
                    type: 'success',
                    message: "文章导出成功"
                })
            }
        },
        async importFileEvent() {
            // 如果导入了文件
            const { data } = await importFile()
            const impored = data.data
            this.importPost(impored)
            if (impored) {
                this.$router.push({ path: '/post', query: { import: 1 } })
            }
        }
    },
    watch: {
        query: {
            handler() {
                this.fetchList()
            },
            deep: true
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
<style lang="scss" scoped>
.nodata {
    padding: 20px;
    flex-shrink: 0;
}
.post-list {
    padding: 45px 0 0 0;
    height: 100vh;
    display: flex;
    overflow: hidden;
    & > .item-list {
        flex-wrap: wrap;
        flex-shrink: 0;
        display: flex;
        overflow: scroll;
        border-right: 1px solid #ccc;
        width: 100%;
        transition: width 1s ease;
        &.open {
            width: 300px;
            display: block;
        }
    }
    & > .post-privew {
        position: relative;
        overflow: scroll;
        border-right: 1px solid #ccc;
        width: 0;
        transition: width 1s ease;
        &.open {
            width: 100%;
        }
    }
}
</style>
