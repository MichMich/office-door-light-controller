import { protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const { menubar } = require('menubar')
const ipc = require('electron').ipcMain
const path = require('path')

const mb = menubar({
  icon: path.join(__static, 'icons/off.png'),
  index: false,
  browserWindow: {
    alwaysOnTop: true,
    height: 250,
    resizable: false,
    width: 250,
    transparent: true,
    vibrancy: 'menu',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  }
})

const setIcon = (state) => {
  let icon
  if (state.red) {
    icon = path.join(__static, '/icons/red.png')
  } else if (state.orange) {
    icon = path.join(__static, '/icons/orange.png')
  } else if (state.green) {
    icon = path.join(__static, '/icons/green.png')
  } else {
    icon = path.join(__static, '/icons/off.png')
  }

  mb.tray.setImage(icon)
}

mb.on('after-create-window', async () => {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mb.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) mb.window.webContents.openDevTools()
  } else {
    createProtocol('app')
    mb.window.loadURL('app://./index.html')
  }

  mb.on('after-hide', async () => {
    mb.window.webContents.send('hide')
  })

  ipc.on('state', function (event, state) {
    setIcon(state)
  })

  ipc.on('show', function (event) {
    mb.showWindow()
  })

  ipc.on('hide', function (event) {
    mb.hideWindow()
  })

  ipc.on('log', function (event, payload) {
    console.log(payload)
  })
})

mb.on('ready', () => {
  mb.showWindow()
})
