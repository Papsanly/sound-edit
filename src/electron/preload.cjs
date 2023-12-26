const { contextBridge } = require('electron')
const crypto = require('crypto')

const electronHandler = {
  generateId() {
    return crypto.randomBytes(8).toString('hex')
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)
