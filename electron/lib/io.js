'use strict'
const { dialog, BrowserWindow, app } = require('electron')
const fs = require('fs')
const path = require('path')
const userDataPath = app.getPath('userData')

// 获取保存路径
function selectPathForWrite(filters, filename = '未命名') {
    let filePath = dialog.showSaveDialogSync({
        filters,
        defaultPath: filename,
        title: '导出',
        buttonLabel: '导出'
    })
    if (!filePath) return
    return filePath
}

function getHtml(title, body) {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="CEditor">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cyyjs.github.io/static/md.css">
    </head>
    <body class="markdown-body code-github">
      <h1>${title}</h1>
      ${body}
    </body>
  </html>`
}


// 导出文件
const exportFile = async ({ type, title, mk, html }) => {
    var filters = [
        {
            name: title,
            extensions: [type]
        }
    ]

    let filePath = selectPathForWrite(filters, title)
    if (!filePath) {
        return { code: 0, message: '取消' }
    }
    let content
    if (type === 'md') {
        content = mk
        fs.writeFileSync(filePath, content, 'utf8')
    } else if (type === 'html') {
        content = getHtml(title, html)
        fs.writeFileSync(filePath, content, 'utf8')
    } else if (type === 'pdf') {
        content = getHtml(title, html)
        let tmpPath = path.join(userDataPath, 'tmp.html')
        fs.writeFileSync(tmpPath, content, 'utf8')
        let win = new BrowserWindow({
            width: 768,
            height: 1024,
            show: false
        })
        win.loadURL('file://' + tmpPath)
        let contents = win.webContents
        contents.on('did-finish-load', async () => {
            const data = await contents.printToPDF({
                printBackground: true
            })
            fs.writeFileSync(filePath, data)
            win.close()
            // 删除HTML文件
            fs.unlinkSync(tmpPath)
            // , (error, data) => {
            //     if (error) throw error
            //     fs.writeFileSync(filePath, data)
            //     win.close()
            //     // 删除HTML文件
            //     fs.unlinkSync(tmpPath)
            // })
        })
    }
    return { code: 1, message: '导出成功' }
}
const importFile = async () => {
    let path = getFilePath()
    if (!path || !path.length) {
        return { code: 0, message: '取消' }
    }
    let post = fs.readFileSync(path[0], 'utf8')
    let heads = {}
    let content = ''

    let posts = post.split('---\n').slice(1)
    if (posts.length) {
        let meta = posts.shift().split('\n')
        content = posts
            .join('---\n')
            .replace(/^(\n)*/, '')
            .trim()
        meta.forEach(item => {
            if (item.includes(':')) {
                let vs = item.split(':')
                let k = vs[0]
                let v = vs
                    .slice(1)
                    .join(':')
                    .trim()
                if (k === 'tags') {
                    v = v.replace(/\[|\]|"/g, '').split(',')
                } else if (k === 'date' || k === 'updated') {
                    v = new Date(v) || new Date()
                }
                heads[k] = v
            }
        })
    } else {
        const ps = path[0].split('/')
        const psStr = ps[ps.length - 1]
        let title = psStr.substring(0, psStr.lastIndexOf('.'))
        heads.title = title
        content = post
    }
    let data = {
        ...heads,
        content,
        created: heads.date || new Date(),
        status: 0
    }
    return { code: 1, data }
}
const getFilePath = () => {
    let path = dialog.showOpenDialogSync({
        filters: [
            {
                name: 'MD文件',
                extensions: ['md']
            }
        ],
        properties: ['openFile'],
        message: '选择要导入的Mackdown文件',
        buttonLabel: '导入'
    })
    return path
}

// 获取目录
// const getPath = () => {
//     let path = dialog.showOpenDialogSync({
//         properties: ['createDirectory', 'openDirectory'],
//         buttonLabel: '选择'
//     })
//     return path
// }

module.exports = {
    exportFile,
    importFile
}