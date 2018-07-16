<template>
    <div id="left-nav">
        <mu-drawer :open="true" class="left-nav mu-primary-color drag" :width="70">
          <mu-list>
            <mu-list-item @click.native="$router.push('/post?r='+Math.random())">
                <mu-button icon :class="{active: active === 'post'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jiahao"></use>
                    </svg>
                </mu-button>
            </mu-list-item>
            <mu-list-item @click.native="$router.push('/')">
                <mu-button icon :class="{active: active === 'list'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-liebiao"></use>
                    </svg>
                </mu-button>
            </mu-list-item>
            <mu-list-item @click.native="$router.push('/types')">
                <mu-button icon :class="{active: active === 'types'}">
                    <svg class="icon" aria-hidden="true" >
                        <use xlink:href="#icon-fenlei"></use>
                    </svg>
                </mu-button>
            </mu-list-item>
            <mu-list-item @click.native="$router.push('/tags')">
                <mu-button icon :class="{active: active === 'tags'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-biaoqian"></use>
                    </svg>
                </mu-button>
            </mu-list-item>
          </mu-list>
        </mu-drawer>
        <mu-button icon :class="['setting', active === 'setting'? 'active':'']" @click.native="$emit('showSetting')">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shezhi"></use>
            </svg>
        </mu-button>
        <mu-button icon style="bottom: 61px;" :class="['setting', active === 'trash'? 'active':'']" @click.native="$router.push('/trash')">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-iconset0213"></use>
            </svg>
        </mu-button>
    </div>
</template>
<script>
// import { mapState, mapActions } from "vuex";
export default {
    data() {
        return {}
    },
    computed: {
        active() {
            return this.$route.name
        },
        // ...mapState({
        //   user: ({ user }) => user.user || {},
        //   open: ({ sys }) => sys.openNav || false
        // }),
        headUrl() {
            return 'http://ogd60qga4.bkt.clouddn.com/logo.jpeg'
        }
    }
}
</script>
<style scoped>
.icon {
    color: #fff;
}
.setting {
    position: fixed;
    bottom: 11px;
    left: 11px;
    z-index: 201;
    color: #fff;
    padding: 8px;
}
.left-nav {
    padding-top: 30px;
}
.active {
    background: rgba(204, 204, 204, 0.3);
}
</style>
