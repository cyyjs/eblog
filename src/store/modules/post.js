import Axios from 'axios';
import Config from '../../../config';
import Util from '../../util';
import BlogDB from '../db';
const API_URL = Config.API_URL
Axios.defaults.baseURL = API_URL

const getPromistList = (online, local) => {
    let list = []
    online.forEach(l => {
        if (!l._id || l._id.startsWith('local_')) {
            delete l._id
            list.push(Axios.post('blog/post', l))
        } else {
            list.push(Axios.put(`blog/post/${l._id}`, l))
        }
    })

    local.forEach(l => {
        list.push(BlogDB.upset(l))
    })

    return Promise.all(list)
}
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
        let post = {}
        if (navigator.onLine) {
            let { data } = await Axios.get(`blog/post/${id}`)
            if (data.errno) {
                dispatch('setMessage', {
                    type: 'error',
                    message: data.errmsg || '文章获取失败'
                })
                return {}
            }
            post = data.data
        } else {
            post = await BlogDB.findOne(id)
        }
        dispatch('setLoading', false)
        return post
    },
    setPostListEmpty({ commit }) {
        commit('SET_POST_PAGE', [])
    },
    // 数据同步
    async synchrodata({ dispatch }) {
        if (navigator.onLine) {
            let { data } = await Axios.get('blog/post')
            if (data.errno) {
                dispatch('setMessage', {
                    type: 'error',
                    message: data.errmsg || '文章列表获取失败'
                })
            } else {
                let dataOnline = (data.data && data.data.data) || []
                let dataLocal = await BlogDB.find()
                let { online, local } = Util.diffPost(dataOnline, dataLocal)
                await getPromistList(online, local)
            }
        }
    },
    async getListPost({ commit, dispatch }, query) {
        dispatch('setLoading', true)
        let page = { data: [] }
        let queryAll = !query || !Object.keys(query).length
        if (navigator.onLine) {
            let { data } = await Axios.get('blog/post', { params: query })
            if (data.errno) {
                dispatch('setMessage', {
                    type: 'error',
                    message: data.errmsg || '文章列表获取失败'
                })
            }
            page = data.data || []
            // if (queryAll) {
            //     // 同步数据
            //     await BlogDB.addList(page.data)
            // }
        } else {
            page.data = await BlogDB.find(query)
        }
        if (queryAll) {
            commit('SET_POST_FULL', page)
        }
        commit('SET_POST_PAGE', page)
        dispatch('setLoading', false)
    },
    async createPost({ dispatch }, post) {
        dispatch('setLoading', true)
        let id = ''
        let msg = ''
        if (navigator.onLine) {
            let { data } = await Axios.post('blog/post', post)
            if (!data.errno) {
                id = data.data && data.data._id
                post = data.data
            } else {
                msg = data.errmsg || '保存失败'
            }
        } else {
            post._id = 'local_' + Date.now()
            id = post._id
        }
        await BlogDB.add(post)
        if (!msg) {
            dispatch('setMessage', { type: 'success', message: '保存成功' })
        } else {
            dispatch('setMessage', {
                type: 'error',
                message: msg
            })
        }
        dispatch('getListPost')
        return id
    },
    async updatePost({ dispatch }, post) {
        dispatch('setLoading', true)
        let str = '保存'
        if (post.status === 2) {
            str = '删除'
        }
        let msg = ''
        if (navigator.onLine) {
            let id = post._id
            delete post._id
            let { data } = await Axios.put(`blog/post/${id}`, post)
            if (data.errno) {
                msg = data.errmsg || str + '失败'
            }
        } else {
            await BlogDB.update(post)
        }
        if (!msg) {
            dispatch('setMessage', { type: 'success', message: str + '成功' })
        } else {
            dispatch('setMessage', {
                type: 'error',
                message: msg
            })
        }
        dispatch('setLoading', false)
        return msg
    },
    async deletePost({ dispatch }, id) {
        dispatch('setLoading', true)
        let msg = ''
        if (navigator.onLine) {
            let { data } = await Axios.delete(`blog/post/${id}`)
            if (data.errmsg) {
                msg = data.errmsg || '删除失败'
            }
        }
        await BlogDB.remove(id)
        if (!msg) {
            dispatch('setMessage', {
                type: 'success',
                message: '删除成功'
            })
        } else {
            dispatch('setMessage', { type: 'error', message: msg })
        }
        dispatch('setLoading', false)
        return
    }
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
