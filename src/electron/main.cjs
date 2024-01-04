const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')
const path = require('path')

require('./loadAudio.cjs')
require('./message.cjs')
require('./saveAudio.cjs')

const loadURL = serve({ directory: 'dist' })

let mainWindow

function isDev() {
  return !app.isPackaged
}

function createWindow() {
  if (isDev()) {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    backgroundColor: 'black',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(51, 51, 51, 1)',
      symbolColor: 'rgba(156, 156, 156, 1)',
      height: 34,
    },
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5173/').then()
    mainWindow.webContents.openDevTools()
  } else {
    loadURL(mainWindow)
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
