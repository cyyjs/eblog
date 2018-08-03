<template>
    <div id="privewEditor" >
        <div class="title">
            <h2 class="ellipsis1">
                {{post.title}}
            </h2>
            <div class="tags">
                <mu-list class="title-left">
                    <mu-chip class="chip" text-color="#fff" color="primary" v-for="v in post.tags" :key="v">
                        {{v}}
                    </mu-chip>
                </mu-list>
                <span class="time">{{date}}</span>
            </div>
        </div>
        <mavon-editor 
            ref="editor"
            v-model="post.content" 
            :subfield="false"
            defaultOpen="preview"
            :editable="false"
            :toolbarsFlag="false"
            :codeStyle="setting.codeStyle"
            :imageClick="imgClk"
        ></mavon-editor>
    </div>
</template>
<script>
import 'mavon-editor/dist/css/index.css'
import Util from '../../util'
import { mapState } from 'vuex'
export default {
    props: {
        post: {
            type: Object,
            default: () => ({
                content: ''
            })
        }
    },
    computed: {
        ...mapState({
            setting: ({ sys }) => sys.setting
        }),
        date() {
            return this.post.updated
                ? Util.formatDateYYYYMMDD(this.post.updated)
                : ''
        }
    },
    methods: {
        getHtml() {
            return this.$refs.editor.d_render
        },
        imgClk() {}
    }
}
</script>
<style lang="scss">
.open > #privewEditor > .title {
    left: 370px;
}
#privewEditor {
    position: relative;
    & > .title {
        transition: left 1s ease;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
        position: fixed;
        top: 45px;
        right: 0;
        left: 120vw;
        z-index: 1504;
        padding: 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .tags {
            margin-bottom: 10px;
            text-align: right;
            & > .title-left {
                width: inherit;
                float: left;
                padding: 0;
            }
            & > .time {
                color: #666;
            }
        }
        .chip {
            margin-right: 10px;
            line-height: 24px;
        }
    }
    & > .markdown-body {
        margin-top: 100px;
    }
}
</style>
