<template>
    <div class="top-head drag">
        <div class="title">
            <div class="left">
                <mu-form :inline="true" :model="postQuery" style="padding-top:5px;">
                    <mu-select
                        label
                        v-model="postQuery.category"
                        class="type-select no-border"
                        @change="change(1)"
                    >
                        <mu-option v-for="t in types" :key="t" :label="t" :value="t"></mu-option>
                    </mu-select>
                    <mu-select
                        label
                        v-model="postQuery.tag"
                        class="type-select no-border"
                        style="margin:0 10px;margin-right:0;"
                        @change="change()"
                    >
                        <mu-option v-for="t in tags" :key="t" :label="t" :value="t"></mu-option>
                    </mu-select>
                    <mu-button icon small color="primary" class="status-icon" @click="changeStatus">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="statusIcon"></use>
                        </svg>
                    </mu-button>
                    <mu-text-field
                        placeholder="文章搜索..."
                        v-model="postQuery.q"
                        @input="change()"
                        class="search no-border nodrag"
                    >
                        <svg class="search-icon icon" slot="prepend" aria-hidden="true">
                            <use xlink:href="#icon-search"></use>
                        </svg>
                    </mu-text-field>
                </mu-form>
            </div>
            <mu-tooltip :content="viewType == 1 ? '卡片视图':'摘要视图'">
                <mu-button flat small ref="viewButton" class="view-button" @click="changeView()">
                    <svg v-if="viewType==1" class="view-icon icon" aria-hidden="true">
                        <use xlink:href="#icon-plus-gridview"></use>
                    </svg>
                    <svg v-else class="view-icon icon" aria-hidden="true">
                        <use xlink:href="#icon-yduipaibanleixingliebiao"></use>
                    </svg>
                </mu-button>
            </mu-tooltip>
            <mu-tooltip content="操作">
                <mu-button
                    v-show="showOptionBtn"
                    flat
                    small
                    ref="optionButton"
                    class="option-button"
                    @click="open2 = !open2"
                >
                    <svg class="view-icon icon" aria-hidden="true">
                        <use xlink:href="#icon-youcecaidan"></use>
                    </svg>
                </mu-button>
            </mu-tooltip>
            <mu-popover cover :open.sync="open2" :trigger="trigger2">
                <mu-list>
                    <mu-list-item button @click="$emit('import')">
                        <mu-list-item-action class="item-action">
                            <svg class="view-icon icon" aria-hidden="true">
                                <use xlink:href="#icon-daoru"></use>
                            </svg>
                        </mu-list-item-action>
                        <mu-list-item-title>导入 MD文件</mu-list-item-title>
                    </mu-list-item>
                    <mu-divider v-show="viewType==2"></mu-divider>
                    <mu-list-item button @click="$emit('export','md')" v-show="viewType==2">
                        <mu-list-item-action class="item-action">
                            <svg class="view-icon icon" aria-hidden="true">
                                <use xlink:href="#icon-md"></use>
                            </svg>
                        </mu-list-item-action>
                        <mu-list-item-title>导出 MD文件</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button @click="$emit('export','html')" v-show="viewType==2">
                        <mu-list-item-action class="item-action">
                            <svg class="view-icon icon" aria-hidden="true">
                                <use xlink:href="#icon-HTML"></use>
                            </svg>
                        </mu-list-item-action>
                        <mu-list-item-title>导出 HTML</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button @click="$emit('export','pdf')" v-show="viewType==2">
                        <mu-list-item-action class="item-action">
                            <svg class="view-icon icon" aria-hidden="true">
                                <use xlink:href="#icon-pdf1"></use>
                            </svg>
                        </mu-list-item-action>
                        <mu-list-item-title>导出 PDF</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-popover>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
    data() {
        return {
            postQuery: {
                category: '全部',
                tag: '全部',
                status: 0,
                q: ''
            },
            open: false,
            open2: false,
            trigger: null,
            trigger2: null
        }
    },
    computed: {
        ...mapGetters(['typeList', 'tagList']),
        ...mapState({
            viewType: ({ sys }) => sys.viewType,
            query: ({ post }) => post.query
        }),
        statusIcon() {
            return (
                ['#icon-fabu3', '#icon-fabu2'][this.postQuery.status] ||
                '#icon--quanbujiao'
            )
        },
        types() {
            let list = Object.keys(this.typeList)
            list.unshift('全部')
            return list
        },
        tags() {
            let list = Object.keys(this.tagList)
            list.unshift('全部')
            return list
        },
        showOptionBtn() {
            let f = false
            if (this.$route.path === '/') {
                f = true
            }
            return f
        }
    },
    methods: {
        ...mapActions(['setViewType', 'exportFile', 'setPostQuery']),
        change(flag) {
            if (flag) {
                this.postQuery.tag = '全部'
                this.postQuery.q = ''
            }
            this.setPostQuery(this.postQuery)
        },
        changeView() {
            let t = this.viewType === 1 ? 2 : 1
            this.open = false
            this.setViewType(t)
        },
        changeStatus() {
            if (this.postQuery.status === '') {
                this.postQuery.status = 0
            } else if (this.postQuery.status === 1) {
                this.postQuery.status = ''
            } else {
                this.postQuery.status++
            }
            this.change()
        }
    },
    mounted() {
        this.postQuery = { ...this.query }
        this.trigger = this.$refs.viewButton.$el
        this.trigger2 = this.$refs.optionButton.$el
    }
}
</script>
<style lang="scss" scoped>
.top-head {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    z-index: 1;
    .title {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: right;
        line-height: 45px;
        .left {
            margin-left: 80px;
            height: 45px;
            float: left;
            line-height: 45px;
            &:after {
                content: " ";
                clear: both;
            }
        }
    }
    .view-button {
        min-width: 30px;
        margin-top: 3px;
        background-color: none;
        margin-right: 10px;
    }
    .option-button {
        min-width: 30px;
        margin-right: 10px;
    }
}
.item-action {
    min-width: 30px;
}
.type-select {
    width: 65px;
    font-size: 1.2rem;
    margin: 0;
    padding: 0;
    min-height: 40px;
}
.search-icon {
    margin-right: -25px;
    z-index: 1;
}
.view-icon {
    font-size: 1.2rem;
}
.search {
    min-height: inherit;
    margin: 0;
    padding: 0;
    font-weight: normal;
    width: 120px;
    transition: width 1s ease;
}
.view-select {
    width: 100px;
}
.status-icon {
    padding: 5px;
    margin-right: 10px;
}
</style>
