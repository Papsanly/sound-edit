const { ipcRenderer, contextBridge } = require('electron')
const crypto = require('crypto')

const electronHandler = {
  send(channel, ...args) {
    ipcRenderer.send(channel, ...args)
  },
  on(channel, func) {
    const subscription = (_event, ...args) => func(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  generateId() {
    return crypto.randomBytes(8).toString('hex')
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)
