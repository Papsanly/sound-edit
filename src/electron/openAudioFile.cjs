const { ipcMain, dialog } = require('electron')
const path = require('path')
const crypto = require('crypto')

ipcMain.on('open-file-dialog', event => {
  dialog
    .showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    })
    .then(result => {
      if (!result.canceled) {
        event.sender.send(
          'selected-file',
          result.filePaths.map(filePath => {
            const fileName = path.basename(filePath)
            const lastDotIndex = fileName.lastIndexOf('.')
            const id = crypto.randomBytes(16).toString('hex')
            return {
              id,
              fileName: fileName.slice(0, lastDotIndex),
              length: 3000,
            }
          }),
        )
      }
    })
    .catch(err => {
      dialog.showErrorBox('An Error occured', err)
    })
})

module.exports = ipcMain
