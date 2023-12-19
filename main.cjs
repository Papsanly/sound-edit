const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')
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
    backgroundColor: 'black',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  })
  mainWindow.maximize()

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