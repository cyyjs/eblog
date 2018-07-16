import Config from '../../../config'
import Axios from 'axios'
// const userPath = window.require("electron").remote.app.getPath("userData");
// console.log(userPath);
const API_URL = Config.API_URL
Axios.defaults.baseURL = API_URL
// Axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// import UploadAPI from "../../../electron/lib/upload";
// console.log(UploadAPI);
// import { PostDB } from "../db";
// import Io from "../../../lib/io";
// import {def as defaultContent} from '../../../data/static'

// const moment = require("moment");

// const Reg = /!\[[^[]*?\]\(\s*([^)|^\s]+)(?=\s*\))/g;
// const defaultContent = fs.readFileSync(path.join(__static, 'default.md')).toString()
const state = {
    fullList: [],
    import_post: {},
    page: [],
    query: {
        category: '全部',
        tag: '全部',
        status: '',
        q: ''
    }
}

const mutations = {
    SET_POST_FULL(state, data) {
        state.fullList = data
    },
    SET_POST_PAGE(state, data) {
        state.page = data
    },
    SET_POST(state, data) {
        state.post = data
    },
    SET_IMPORT_POST(state, data) {
        state.import_post = data
    },
    SET_POST_QUERY(state, data) {
        state.query = data
    }
}

const actions = {
    importPost({ commit }, post) {
        commit('SET_IMPORT_POST', post)
    },
    setPostQuery({ commit }, data) {
        commit('SET_POST_QUERY', data)
    },
    // 保存上传图片
    async saveImg(v, file) {
        let formdata = new FormData()
        formdata.append('file', file)
        let {
            data: {
                data: { url }
            }
        } = await Axios({
            url: 'upload',
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        return url
    },
    async getPost({ dispatch }, id) {
        dispatch('setLoading', true)
        let { data } = await Axios.get(`blog/post/${id}`)
        dispatch('setLoading', false)
        if (data.errno) {
            dispatch('setMessage', {
                type: 'error',
                message: data.errmsg || '文章获取失败'
            })
            return {}
        } else {
            return data.data
        }
    },
    setPostListEmpty({ commit }) {
        commit('SET_POST_PAGE', [])
    },
    async getListPost({ commit, dispatch }, query) {
        dispatch('setLoading', true)
        let { data } = await Axios.get('blog/post', { params: query })
        if (data.errno) {
            dispatch('setMessage', {
                type: 'error',
                message: data.errmsg || '文章列表获取失败'
            })
        }

        if (!query || !Object.keys(query).length) {
            commit('SET_POST_FULL', data.data)
        }
        commit('SET_POST_PAGE', data.data)
        dispatch('setLoading', false)
    },
    async createPost({ dispatch }, post) {
        dispatch('setLoading', true)
        let { data } = await Axios.post('blog/post', post)
        let id = ''
        if (!data.errno) {
            dispatch('setMessage', { type: 'success', message: '保存成功' })
            id = data.data
        } else {
            dispatch('setMessage', {
                type: 'error',
                message: data.errmsg || '保存失败'
            })
        }
        dispatch('getListPost')
        return id
    },
    async updatePost({ dispatch }, post) {
        dispatch('setLoading', true)
        let id = post._id
        delete post._id
        let { data } = await Axios.put(`blog/post/${id}`, post)
        let str = '保存'
        if (post.status === 2) {
            str = '删除'
        }
        if (!data.errno) {
            dispatch('setMessage', { type: 'success', message: str + '成功' })
        } else {
            dispatch('setMessage', {
                type: 'error',
                message: data.errmsg || str + '失败'
            })
        }
        dispatch('setLoading', false)
        return data
    },
    async deletePost({ dispatch }, id) {
        dispatch('setLoading', true)
        let { data } = await Axios.delete(`blog/post/${id}`)
        if (!data.errmsg) {
            dispatch('setMessage', { type: 'success', message: '删除成功' })
        } else {
            dispatch('setMessage', {
                type: 'error',
                message: data.errmsg || '删除失败'
            })
        }
        dispatch('setLoading', false)
        return
    }
    //   createNote({ commit }) {
    //     commit("SET_POST", {});
    //   },
    //   // 获取文章列表
    //   async getNoteList({ commit }, query = {}) {
    //     let data = await PostDB.findSort(query, { updated: -1 });
    //     commit("SET_NOTE_LIST", data);
    //     return data;
    //   },

    //   // 按月份获取文章列表
    //   async getNoteGroupMonth({ commit }, query = {}) {
    //     let data = await PostDB.findSort(query, { updated: -1 });
    //     let map = {};
    //     data.forEach(item => {
    //       let m = moment(item.updated).format("YYYY-MM");
    //       map[m] = map[m] || [];
    //       map[m].push(item);
    //     });
    //     return map;
    //   },

    //   // 保存文章
    //   async saveNote({ commit, dispatch }, post) {
    //     let user = dispatch("getUser");
    //     post.userID = user._id;
    //     post.date = new Date();
    //     post.updated = new Date();
    //     let img = Reg.exec(post.content);
    //     if (img && img.length > 0) {
    //       img = img[1];
    //       post.thumbnail = img;
    //     }
    //     let r = await PostDB.insert(post);
    //     return r;
    //   },

    //   // 获取某个文章
    //   async getNote({ commit }, _id) {
    //     let post = await PostDB.findOne({ _id });
    //     commit("SET_POST", post);
    //     return post;
    //   },

    //   // 保存或修改文章
    //   async saveOrUpdateNote({ commit, dispatch }, post) {
    //     post.updated = new Date();
    //     let img = Reg.exec(post.content);
    //     if (img && img.length > 0) {
    //       img = img[1];
    //       post.thumbnail = img;
    //     }
    //     let r;
    //     if (post._id) {
    //       r = await PostDB.update({ _id: post._id }, { $set: post });
    //       dispatch("getNote", post._id);
    //     } else {
    //       delete post._id;
    //       let user = await dispatch("getUser");
    //       post.userID = user._id;
    //       post.date = new Date();
    //       post.publish = false;
    //       r = await PostDB.insert(post);
    //       dispatch("getNote", r._id);
    //     }
    //     return r;
    //   },

    //   // 删除文章
    //   async deleteNote({ commit, dispatch }, _id) {
    //     let r = await PostDB.remove({ _id });
    //     dispatch("getNoteList");
    //     return r;
    //   },

    //   // 文件导出
    //   async exportFile({ commit, dispatch }, data) {
    //     let user = await dispatch("getUser");
    //     if (data.type === "hexo") {
    //       commit("SET_PUBLISHING", true);
    //     }
    //     await Io.export(data, user);
    //     commit("SET_PUBLISHING", false);
    //     dispatch("getNote", data._id);
    //   },

    //   // 取消发布
    //   async dePublish({ dispatch }, _id) {
    //     let user = await dispatch("getUser");
    //     await Io.dePublish(_id, user);
    //     dispatch("getNote", _id);
    //   }
}
const getters = {
    typeList({ fullList }) {
        let list = fullList.data || []
        let map = {}
        list.forEach(p => {
            map[p.category] = map[p.category] || 0
            map[p.category]++
        })
        return map
    },
    tagList({ fullList }) {
        let list = fullList.data || []
        let map = {}
        list.forEach(p => {
            p.tags.forEach(t => {
                map[t] = map[t] || 0
                map[t]++
            })
        })
        return map
    }
}
export default {
    state,
    mutations,
    getters,
    actions
}
