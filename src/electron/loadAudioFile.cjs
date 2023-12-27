const { ipcMain, dialog } = require('electron')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs').promises

async function loadFile(id, filePath) {
  const fileName = path.basename(filePath)
  const lastDotIndex = fileName.lastIndexOf('.')

  const data = await fs.readFile(filePath)
  const base64Data = data.toString('base64')
  const url = `data:audio/${path.extname(filePath)};base64,${base64Data}`

  return {
    id,
    name: fileName.slice(0, lastDotIndex),
    path: filePath,
    url,
  }
}

ipcMain.on('show-error', (_, title, message) => {
  dialog
    .showMessageBox({
      type: 'error',
      title,
      message: JSON.stringify(message),
    })
    .then()
})

ipcMain.on('load-files', async (event, data) => {
  const promises = data.map(({ id, path }) => loadFile(id, path))
  const results = await Promise.allSettled(promises)
  const audioData = []
  for (let i = 0; i < results.length; i++) {
    const { id } = data[i]
    const result = results[i]
    if (result.status === 'fulfilled')
      audioData.push({ id, url: result.value.url })
    else
      await dialog.showMessageBox({
        type: 'error',
        title: 'Error loading audio file',
        message: JSON.stringify(result.reason),
      })
  }
  event.sender.send('loaded-files', audioData)
})

ipcMain.on('open-file-dialog', async event => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
    })

    if (result.canceled) {
      event.sender.send('open-file-canceled')
      return
    }

    const promises = result.filePaths.map(filePath => {
      const id = crypto.randomBytes(8).toString('hex')
      return loadFile(id, filePath)
    })

    const audioData = []
    const results = await Promise.allSettled(promises)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled') audioData.push(result.value)
      else
        dialog
          .showMessageBox({
            type: 'error',
            title: 'Error reading audio file',
            message: JSON.stringify(result.reason),
          })
          .then()
    }

    event.sender.send('selected-files', audioData)
  } catch (err) {
    dialog
      .showMessageBox({
        type: 'error',
        title: 'An error occured',
        message: JSON.stringify(err),
      })
      .then()
  }
})

module.exports = ipcMain
