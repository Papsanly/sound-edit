const { ipcMain, dialog } = require('electron')
const fs = require('fs').promises

ipcMain.on('save-audio', async (event, blob) => {
  try {
    const result = await dialog.showSaveDialog({})
    if (!result.canceled) {
      await fs.writeFile(result.filePath, Buffer.from(blob))
    }
    event.reply('saved-audio', result.filePath)
  } catch (error) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Error rendering audio file',
      message: JSON.stringify(error.message),
    })
    event.reply('saved-audio')
  }
})
