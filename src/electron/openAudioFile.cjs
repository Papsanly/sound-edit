const { ipcMain, dialog } = require('electron')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')

ipcMain.on('open-file-dialog', event => {
  dialog
    .showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    })
    .then(result => {
      if (result.canceled) {
        return
      }
      result.filePaths.map(filePath => {
        const fileName = path.basename(filePath)
        const lastDotIndex = fileName.lastIndexOf('.')
        const id = crypto.randomBytes(8).toString('hex')

        fs.readFile(filePath, (err, data) => {
          if (err) {
            dialog.showErrorBox('An error occured', err.message)
            return
          }

          const base64Data = data.toString('base64')
          const url = `data:audio/${path.extname(
            filePath,
          )};base64,${base64Data}`

          event.sender.send('selected-file', {
            id,
            name: fileName.slice(0, lastDotIndex),
            path: filePath,
            url,
          })
        })
      })
    })
    .catch(err => {
      dialog.showErrorBox('An error occured', err)
    })
})

module.exports = ipcMain
