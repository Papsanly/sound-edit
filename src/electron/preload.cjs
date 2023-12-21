const { contextBridge, ipcRenderer } = require('electron')

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
}

contextBridge.exposeInMainWorld('electron', electronHandler)
