// Modules to control application life and create native browser window
const Menu = require('./lib/menu')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
global.__rooturl = path.join(__dirname, '../').replace(/\\/g, '\\\\')
let winurl = isDev
    ? 'http://localhost:8082'
    : 'file://' + path.join(__dirname, '../dist/index.html')
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'EBlog',
        height: 720,
        useContentSize: true,
        width: 1110,
        titleBarStyle: 'hidden',
        // backgroundColor: "#2e2c29",
        minWidth: 1110,
        minHeight: 720
        // show: false
        // transparent: true
    })

    // and load the index.html of the app.

    mainWindow.loadURL(winurl)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        Menu.showEditor()
        if (isDev) {
            let installExtension = require('electron-devtools-installer')
            installExtension
                .default(installExtension.VUEJS_DEVTOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch(err => {
                    console.log('无法安装 `vue-devtools`: \n', err)
                })
            // Open the DevTools.
            mainWindow.webContents.openDevTools()
        }
    })
    // mainWindow.on('focus', () => {
    //     MyMenu.showEditor()
    // })
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
