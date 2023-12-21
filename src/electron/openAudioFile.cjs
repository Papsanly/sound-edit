const { ipcMain, dialog } = require('electron')

ipcMain.on('open-file-dialog', event => {
  dialog
    .showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    })
    .then(result => {
      if (!result.canceled) {
        event.sender.send('selected-file', result.filePaths)
      }
    })
    .catch(err => {
      dialog.showErrorBox('An Error occured', err)
    })
})

module.exports = ipcMain
