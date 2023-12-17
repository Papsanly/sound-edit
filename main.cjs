const { app, BrowserWindow } = require('electron')
const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'dist' })

let mainWindow

function isDev() {
  return !app.isPackaged
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'public/favicon.png'),
    show: false,
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5173/').then()
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
