const { menubar } = require('menubar')
const ipc = require('electron').ipcMain
const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'dist' })

const mb = menubar({
  index: false,
  icon: path.join(__dirname, '../assets/icons/off.png'),
  browserWindow: {
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
    icon = path.join(__dirname, '../assets/icons/red.png')
  } else if (state.orange) {
    icon = path.join(__dirname, '../assets/icons/orange.png')
  } else if (state.green) {
    icon = path.join(__dirname, '../assets/icons/green.png')
  } else {
    icon = path.join(__dirname, '../assets/icons/off.png')
  }

  mb.tray.setImage(icon)
}

mb.on('after-create-window', () => {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mb.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    loadURL(mb.window)
  }

  ipc.on('state', function (event, state) {
    setIcon(state)
  })
})
