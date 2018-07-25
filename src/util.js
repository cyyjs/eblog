export default class {
    static formatDateYYYYMMDD(date, split) {
        date = date instanceof Date ? date : date ? new Date(date) : new Date()
        let y = date.getFullYear()
        let M = ('0' + (date.getMonth() + 1)).slice(-2)
        let d = ('0' + date.getDate()).slice(-2)
        return [y, M, d].join(split || '-')
    }
    static diffPost(onlineList, localList) {
        let map = {
            online: [], // 存线上
            local: [] // 存本地
        }
        let om = {}
        let lm = {}
        let ids = new Set()
        onlineList.forEach(o => {
            ids.add(o._id)
            om[o._id] = o
        })
        localList.forEach(l => {
            if (l._id) {
                ids.add(l._id)
                lm[l._id] = l
            } else {
                map.online.push(l)
            }
        })
        ids = [...ids]
        ids.forEach(id => {
            let o = om[id]
            let l = lm[id]
            if (!o && l.status !== 2) {
                map.online.push(l)
            } else if (!l) {
                map.local.push(o)
            } else if (o.updated != l.updated) {
                if (o.updated > l.updated) {
                    map.local.push(o)
                } else {
                    map.online.push(l)
                }
            }
        })
        return map
    }
}
