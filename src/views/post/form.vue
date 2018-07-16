<template>
    <div id="editor">
        <h1 class="title-input" v-if="isPreview">{{post.title}}</h1>
        <mu-text-field class="title-input" v-else v-model="post.title" placeholder="请输入标题" :max-length="64"></mu-text-field>
        <mavon-editor ref="editor" v-model="post.content" 
            :subfield="false"
            :codeStyle="setting.codeStyle"
            :toolbars="toolbars"
            placeholder="请输入文章内容..."
            @previewToggle="previewToggle"
            @imgAdd="imgAdd"
            @save="save"
            @change="changeEditor"
        ></mavon-editor>
        <div class="editor-right">
            <h3>文章设置</h3>
            <div>
                <mu-ripple class="upload-btn mu-primary-text-color mu-primary-boder" @click.native="uploadFile">
                    <template v-if="post.banner">
                        <img class="banner" :src="post.banner" alt="封面">
                    </template>
                    <template v-if="!post.banner">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jiahao"></use>
                        </svg>
                        <div>
                            上传封面
                        </div>
                    </template>
                    <input v-show="false" type="file" name="file" ref="file" accept="image/*" @change="selectFile"/>
                </mu-ripple>
            </div>
            <mu-form :model="post" class="form" label-position="top" label-width="100">
                <div>
                    <mu-form-item prop="description" prepend="摘要">
                        <mu-text-field placeholder="请输入文章摘要" multi-line :rows="3" :rows-max="6" :max-length="100" v-model="post.description"></mu-text-field>
                    </mu-form-item>
                </div>
                <div>
                    <mu-select label="分类" v-model="post.category" tags>
                        <mu-option v-for="(category,index) in categorys" :key="index" :label="category" :value="category"></mu-option>
                    </mu-select>
                </div>
                <div>
                    <mu-select label="标签" v-model="post.tags" chips multiple tags>
                        <mu-option v-for="(tag,index) in tags" :key="index" :label="tag" :value="tag"></mu-option>
                    </mu-select>
                </div>
                <mu-checkbox v-model="draft" label="发布"></mu-checkbox>
            </mu-form>
            <div class="footer-btn">
                <mu-button color="primary" @click.native="save">保存</mu-button>
                <mu-button  @click.native="$router.push('/')">关闭</mu-button>
            </div>
        </div>
        <confirm ref='confirm'></confirm>
    </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Confirm from '../../components/Confirm'
import { mapActions, mapState, mapGetters } from 'vuex'
const toolbars = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    /* 2.1.8 */
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    preview: true // 预览
}
let tiem = null
export default {
    components: {
        mavonEditor,
        Confirm
    },
    data() {
        return {
            isPreview: false,
            inited: false,
            toolbars,
            draft: false,
            post: {
                banner: '',
                title: '',
                content: '',
                description: '',
                category: '技术',
                tags: []
            }
        }
    },
    computed: {
        ...mapGetters(['tagList']),
        ...mapState({
            setting: ({ sys }) => sys.setting,
            importPostData: ({ post }) => post.import_post
        }),
        tags() {
            return Object.keys(this.tagList)
        },
        categorys() {
            return ['技术', '生活', '工作', '其他']
        }
    },
    methods: {
        ...mapActions([
            'saveImg',
            'createPost',
            'updatePost',
            'getPost',
            'importPost'
        ]),
        previewToggle(pre) {
            this.isPreview = pre
        },
        async imgAdd(filename, imgfile) {
            let url = await this.saveImg(imgfile)
            if (url) {
                this.$refs.editor.$img2Url(filename, url)
            }
        },
        uploadFile() {
            this.$refs.file.click()
        },
        async selectFile(event) {
            let file = event.target.files[0]
            if (file) {
                let url = await this.saveImg(file)
                if (url) {
                    this.$set(this.post, 'banner', url)
                }
            }
        },
        // deletePost() {
        //     this.$refs.confirm.show(
        //         {
        //             content: '是否删除该文章'
        //         },
        //         async isDelee => {
        //             if (isDelee) {
        //                 if (this.post._id) {
        //                     await this.updatePost({
        //                         _id: this.post._id,
        //                         status: 2
        //                     })
        //                 }
        //                 this.$router.push('/')
        //             }
        //         }
        //     )
        // },
        changeEditor() {
            clearTimeout(tiem)
            if (this.inited) {
                tiem = setTimeout(() => {
                    this.save()
                }, 60000) // 每分钟自动保存
            }
        },
        reset() {
            this.post = {
                banner: '',
                title: '',
                content: '',
                description: '',
                category: '技术',
                tags: []
            }
        },
        async save() {
            let msg = ''
            let post = { ...this.post }
            if (!post.tags.length) {
                msg = '请选择输入标签'
            }
            if (!post.description) {
                msg = '请输入文章摘要'
            }
            // if (!post.banner) {
            //     msg = '请上传封面图'
            // }
            if (!post.content) {
                msg = '请输入内容'
            }
            if (!post.title) {
                msg = '请输入标题'
            }

            if (msg) {
                this.$message({ type: 'warning', message: msg })
                return false
            }
            post.status = this.draft ? 1 : 0
            if (post._id) {
                await this.updatePost(post)
            } else {
                let id = await this.createPost(post)
                this.post._id = id
            }
            return true
        }
    },
    watch: {
        $route() {
            console.log(this.$route)
            let r = this.save()
            if (r) {
                this.reset()
            }
        }
    },
    async mounted() {
        let id = this.$route.params.id
        let isImport = this.$route.query.import
        if (id) {
            let post = await this.getPost(id)
            if (post._id) {
                this.post = Object.assign(post)
                this.draft = this.post.status === 1
            }
        }
        if (isImport) {
            this.post = Object.assign({}, this.importPostData)
            this.importPost({})
        }
        setTimeout(() => {
            this.inited = true
        }, 1000)
    }
}
</script>

<style lang="scss" scoped>
#editor {
    display: flex;
    h1 {
        margin: 0;
        padding: 15px 25px;
    }
    .editor-right {
        position: relative;
        width: 25%;
        h3 {
            margin: 0;
            padding: 10px;
        }
        .upload-btn {
            user-select: none;
            cursor: pointer;
            position: relative;
            margin: 10px;
            height: 140px;
            width: 90%;
            margin: auto;
            text-align: center;
            overflow: hidden;
            & > svg {
                font-size: 2rem;
                margin: 35px 0 10px 0;
            }
        }
        .banner {
            max-width: 100%;
            max-height: 140px;
        }
        .form {
            padding: 10px;
            & > div > div {
                width: 100%;
                margin-bottom: 0;
            }
        }
        .footer-btn {
            text-align: center;
            position: absolute;
            bottom: 0;
            width: 100%;
            & > button {
                margin: 10px;
            }
        }
    }
}
</style>
