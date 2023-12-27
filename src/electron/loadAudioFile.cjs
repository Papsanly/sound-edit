const { ipcMain, dialog } = require('electron')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs').promises

async function loadFile(event, id, filePath, channel) {
  const fileName = path.basename(filePath)
  const lastDotIndex = fileName.lastIndexOf('.')

  try {
    const data = await fs.readFile(filePath)
    const base64Data = data.toString('base64')
    const url = `data:audio/${path.extname(filePath)};base64,${base64Data}`

    event.sender.send(channel, {
      id,
      name: fileName.slice(0, lastDotIndex),
      path: filePath,
      url,
    })
  } catch (err) {
    dialog.showErrorBox('An error occured', err.message)
  }
}

ipcMain.on(
  'load-file',
  async (...args) => await loadFile(...args, 'loaded-file'),
)

ipcMain.on('open-file-dialog', async event => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    })

    if (result.canceled) {
      event.sender.send('open-file-canceled')
    }

    result.filePaths.map(async filePath => {
      const id = crypto.randomBytes(8).toString('hex')
      await loadFile(event, id, filePath, 'selected-file')
    })
  } catch (err) {
    dialog.showErrorBox('An error occured', err)
  }
})

module.exports = ipcMain
