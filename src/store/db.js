const DB_NAME = 'BlogDB'
const PostStore = 'post'
let BlogDB
const request = indexedDB.open(DB_NAME, 1)
request.onerror = function(event) {
    alert('BlogDB error:', event.target)
}
request.onupgradeneeded = function() {
    BlogDB = request.result
    if (!BlogDB.objectStoreNames.contains(PostStore)) {
        BlogDB.createObjectStore(PostStore, { keyPath: '_id' })
    }
}
request.onsuccess = function() {
    BlogDB = request.result
}
const queryPase = (data, query) => {
    if (
        query.tag &&
        Array.isArray(data.tags) &&
        !data.tags.includes(query.tag)
    ) {
        return false
    }
    if (query.category && data.category !== query.category) {
        return false
    }
    if (query.q) {
        return data.title.includes(query.q) || data.content.includes(query.q)
    }
    if (query.status === '0' || +query.status) {
        return data.status === +query.status
    } else {
        return data.status !== 2
    }
}
const getStore = store => {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            if (BlogDB) {
                clearInterval(interval)
                let s = BlogDB.transaction([store], 'readwrite').objectStore(
                    store
                )
                resolve(s)
            }
        }, 200)
    })
}
export default {
    async add(post) {
        let postReq = await getStore(PostStore)
        return new Promise((resolve, reject) => {
            let req = postReq.add(post)
            req.onsuccess = resolve
            req.onerror = reject
        })
    },
    async addList(list) {
        let l = await this.find()
        if ((list[0] && list[0].updated) == (l[0] && l[0].updated)) {
            return Promise.resolve([])
        }
        let plist = list.map(l => this.upset(l))
        return Promise.all(plist)
    },
    async findOne(id) {
        let postReq = await getStore(PostStore)
        return new Promise((resolve, reject) => {
            let req = postReq.get(id)
            req.onerror = reject
            req.onsuccess = function() {
                resolve(req.result)
            }
        })
    },
    async find(query = {}) {
        let postReq = await getStore(PostStore)
        return new Promise(resolve => {
            let list = []
            postReq.openCursor().onsuccess = function(event) {
                let cursor = event.target.result
                if (cursor) {
                    let v = cursor.value
                    if (queryPase(v, query)) {
                        list.push(v)
                    }
                    cursor.continue()
                } else {
                    list = list.sort((a, b) => {
                        return a.updated < b.updated ? 1 : -1
                    })
                    resolve(list)
                }
            }
        })
    },
    async upset(data) {
        if (data._id) {
            let p = await this.findOne(data._id)
            if (p && p.updated !== data.updated) {
                let postReq = await getStore(PostStore)
                await this.remove(data._id)
                return new Promise((resolve, reject) => {
                    let req = postReq.put(data)
                    req.onsuccess = resolve
                    req.onerror = reject
                })
            }
        }
        return this.add(data)
    },
    async update(data) {
        let postReq = await getStore(PostStore)
        return new Promise((resolve, reject) => {
            let req = postReq.put(data)
            req.onsuccess = resolve
            req.onerror = reject
        })
    },
    async remove(id) {
        let postReq = await getStore(PostStore)
        return new Promise((resolve, reject) => {
            let req = postReq.delete(id)
            req.onsuccess = resolve
            req.onerror = reject
        })
    }
}
