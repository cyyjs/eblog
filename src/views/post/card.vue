<template>
    <div>
        <template v-if="isCard">
            <div :class="['item', isTrash ? 'trash':'']"  @dblclick="$router.push('/post/'+item._id)">
                <mu-ripple >
                    <div class="item-title ellipsis2">
                        {{item.title}}
                        <mu-button icon class="remove" color="primary" @dblclick.stop="()=>{}" @click.stop="deleteItem">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shanchu"></use>
                            </svg>
                        </mu-button>
                        <mu-button icon class="back" color="primary" @dblclick.stop="()=>{}" @click.stop="backItem">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-back1"></use>
                            </svg>
                        </mu-button>
                    </div>
                    <div class="item-content ellipsis2">
                        <span class="time mu-primary-text-color">{{date}}</span>{{item.description}}
                    </div>
                    <div class="item-img" :style="{backgroundImage:'url('+item.banner+')'}"> </div>
                </mu-ripple>
            </div>
        </template>
        <template v-else>
            <div ref="item" :data-id="item._id" :class="['item2', openLeftCss]" @wheel="wheelEvent" @dblclick="$router.push('/post/'+item._id)" @click="$emit('selectItem', item)">
                 <mu-ripple class="post-item">
                     <div :class="['item2-content',item.banner?'':'no-img']">
                        <div class="item-title ellipsis1">
                            {{item.title}}
                        </div>
                        <div class="ellipsis2">
                           {{item.description}}
                        </div>
                        <div class="footer">
                            <span class="time mu-primary-text-color">{{date}}</span>
                        </div>
                    </div>
                    <div v-show="item.banner" class="item-img2" :style="{backgroundImage:'url('+item.banner+')'}"> </div>
                </mu-ripple>
                <div class="option">
                    <mu-button v-if="isTrash" @dblclick.stop="()=>{}" @click.stop="backItem"  color="#ccc" fab class="delBtn">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-back"></use>
                        </svg>
                    </mu-button>
                    <mu-button @dblclick.stop="()=>{}" @click.stop="deleteItem"  color="red" fab class="delBtn">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-iconset0213"></use>
                        </svg>
                    </mu-button>
                </div>
            </div>
        </template>
         <confirm ref="confirm"></confirm>
    </div>
</template>
<script>
import Confirm from '../../components/Confirm'
import Util from '../../util'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
let time = null
export default {
    props: {
        item: Object
    },
    components: {
        Confirm
    },
    data() {
        return {
            openLeft: false
        }
    },
    computed: {
        ...mapState({
            viewType: ({ sys }) => sys.viewType
        }),
        isCard() {
            return this.viewType === 1
        },
        date() {
            let d = Util.formatDateYYYYMMDD(this.item.updated, '/')
            return d
        },
        divs() {
            return this.$refs.item.parentNode.parentNode.childNodes
        },
        isTrash() {
            return this.$route.path === '/trash'
        },
        openLeftCss() {
            if (this.openLeft) {
                return this.isTrash ? 'left-open2' : 'left-open'
            } else {
                return ''
            }
        }
    },
    methods: {
        ...mapActions(['updatePost', 'deletePost']),
        wheelEvent($event) {
            clearTimeout(time)
            this.openLeft = $event.deltaX > 0
            let openLeft = $event.deltaX > 0 ? this.openLeftCss : ''
            if (!this.openLeft) {
                return
            }
            time = setTimeout(() => {
                let divs = this.divs
                divs.forEach(div => {
                    let i = div.firstChild
                    let id = i.dataset.id
                    if (id !== this.item._id) {
                        i.className = 'item2'
                    } else {
                        i.className = 'item2 ' + openLeft
                    }
                })
            }, 50)
        },
        backItem() {
            this.$refs.confirm.show(
                {
                    content: '是否还原该文章'
                },
                async isBack => {
                    if (isBack) {
                        await this.updatePost({
                            _id: this.item._id,
                            status: 0
                        })
                        this.$emit('reload')
                    }
                }
            )
        },
        deleteItem() {
            this.$refs.confirm.show(
                {
                    content: this.isTrash
                        ? '是否永久删除该文章'
                        : '是否删除该文章'
                },
                async isDelee => {
                    if (isDelee) {
                        if (this.isTrash) {
                            await this.deletePost(this.item._id)
                        } else {
                            await this.updatePost({
                                _id: this.item._id,
                                status: 2
                            })
                        }
                        this.$emit('reload')
                    }
                }
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.item {
    width: 220px;
    height: 230px;
    background-color: #fff;
    position: relative;
    margin: 20px;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.item-title {
    font-weight: 450;
    font-size: 1rem;
    padding: 10px 10px 5px 10px;
    min-height: 60px;
}
.item-content {
    padding: 0 10px;
    font-size: 0.8rem;
}
.item-img {
    width: 220px;
    height: 120px;
    position: absolute;
    bottom: 0;
    background-size: cover;
    background-repeat: no-repeat;
    transition: background-position 1s ease-in-out;
}
.left-open {
    & > .post-item {
        margin-left: -80px;
    }
}
.left-open2 {
    & > .post-item {
        margin-left: -160px;
    }
}
.item2 {
    display: flex;
    width: 299px;
    overflow: hidden;
    position: relative;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    & > div {
        display: flex;
    }
    .post-item {
        transition: margin-left 0.4s ease-in-out;
        .no-img {
            width: 290px;
        }
    }
    .option {
        width: 80px;
        background-color: red;
        margin-left: 10px;
        color: #fff;
        .delBtn {
            width: 100%;
            height: 100%;
            border-radius: 0;
            .icon {
                font-size: 1.5rem;
            }
        }
    }
    .item-title {
        min-height: inherit;
        padding: 10px 0px 5px 0px;
    }
    .item-content {
        flex-shrink: 0;
        width: 200px;
        padding: 10px 0px 5px 0px;
    }
    .item2-content {
        padding: 0 10px;
        font-size: 0.8rem;
        color: #444;
        width: 200px;
    }
    .item-img2 {
        margin: 5px 0;
        width: 90px;
        height: 90px;
        background-size: cover;
        background-repeat: no-repeat;
        transition: background-position 1s ease-in-out;
    }
    .footer {
        margin-top: 10px;
    }
}
.trash:hover {
    .back {
        display: block;
    }
}
.item,
.item2 {
    &:hover {
        .remove {
            display: block;
        }
        .item-img,
        .item-img2 {
            background-position: right;
        }
    }
}
.time {
    margin-right: 5px;
}
.remove {
    display: none;
    position: absolute;
    right: 0px;
    top: 0px;
    background: #fff;
    width: 35px;
    height: 35px;
}
.back {
    display: none;
    position: absolute;
    right: 25px;
    top: 0px;
    background: #fff;
    width: 35px;
    height: 35px;
}
</style>
