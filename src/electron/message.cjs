const { ipcMain, dialog } = require('electron')

ipcMain.on('show-message', (_, type, title, message) => {
  dialog
    .showMessageBox({
      type,
      title,
      message: JSON.stringify(message),
    })
    .then()
})
