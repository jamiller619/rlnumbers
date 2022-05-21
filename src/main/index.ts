import path from 'node:path'
import process from 'node:process'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { Config } from '@shared/types'
import wait from '@shared/utils/wait'
import logger from '~/utils/logger'
import ConfigService from './services/ConfigService'
import ReplayService from './services/ReplayService'

const isDev = process.env.NODE_ENV === 'development'
const configService = new ConfigService()
const replayService = new ReplayService()

const createWindow = () => {
  const mainWindow = logger(
    new BrowserWindow({
      height: 800,
      width: 1200,
      frame: false,
      show: false,
      backgroundColor: '#1C1C1C',
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1c1c1c',
        symbolColor: '#fff',
      },
      webPreferences: {
        nodeIntegration: false, // default in Electron >= 5
        contextIsolation: true, // default in Electron >= 12
        allowRunningInsecureContent: false,
        // turned on, ONLY in DEV, to allow loading of local
        // files (images) when using the dev server
        webSecurity: isDev ? false : true,
        nodeIntegrationInWorker: true, // multi-threading!
        preload: path.join(__dirname, 'preload.cjs'),
      },
    })
  )

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')

    wait(1).then(() => mainWindow.webContents.openDevTools())
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  }

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })

    return canceled ? undefined : filePaths[0]
  })

  ipcMain.handle('config:get', () => {
    return configService.get()
  })

  ipcMain.handle('config:set', (_, key: keyof Config, value: unknown) => {
    return configService.set(key, value)
  })

  ipcMain.handle(
    'config:update',
    (_, data: { key: keyof Config; value: string }) => {
      configService.emit(`config:update`, data)
    }
  )

  ipcMain.handle('replays:import', (_, dir: string) => {
    return replayService.import(dir)
  })

  ipcMain.handle('replays:get', (_, page?: number, take?: number) => {
    return replayService.getReplays(page, take)
  })
}

app
  .whenReady()
  .then(createWindow)
  .catch((err) => {
    console.error((err as Error)?.message)

    process.exit(0)
  })

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
