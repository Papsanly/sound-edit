const { ipcMain, dialog } = require('electron')
const encodeAudio = require('./encodeAudio.cjs')
const fs = require('fs').promises

ipcMain.on('save-audio', async (event, data) => {
  const encoded = await encodeAudio(
    data.channels,
    data.sampleRate,
    data.encoding,
  )
  try {
    const result = await dialog.showSaveDialog({
      defaultPath: `output.${data.encoding}`,
      filters: [{ name: 'Audio', extensions: ['wav', 'mp3'] }],
    })
    if (!result.canceled) {
      await fs.writeFile(result.filePath, encoded)
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
