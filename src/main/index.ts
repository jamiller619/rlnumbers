import path from 'node:path'
import process from 'node:process'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { Config, ConfigKey, ConfigValue } from '@shared/config'
import { Progress, Replay } from '@shared/types'
import wait from '@shared/utils/wait'
import logger from '~/utils/logger'
import * as configService from './config/config.service'
import * as replayService from './replays/replay.service'
import * as replayWatcher from './replays/replay.watcher'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

const initApp = async () => {
  const config = await configService.getConfig()

  replayWatcher.watch(...config.dirs)
}

const createWindow = async () => {
  logger.info('main', 'Main window created')

  mainWindow =
    mainWindow ||
    new BrowserWindow({
      height: 800,
      width: 1200,
      frame: false,
      show: false,
      backgroundColor: '#161616',
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#161616',
        symbolColor: '#fff',
      },
      webPreferences: {
        nodeIntegration: false, // default in Electron >= 5
        contextIsolation: true, // default in Electron >= 12

        // turned on, ONLY in DEV, to allow loading of local
        // files (images) when using the dev server
        webSecurity: isDev ? false : true,
        preload: path.join(__dirname, 'preload.cjs'),
      },
    })

  mainWindow.once('ready-to-show', async () => {
    mainWindow?.show()

    await wait(3)

    await initApp()
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')

    mainWindow?.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  }

  ipcMain.handle('dialog:openDirectory', async () => {
    if (mainWindow != null) {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })

      return canceled ? undefined : filePaths[0]
    }
  })

  ipcMain.handle('config:get', (_, key: keyof Config) => {
    return configService?.get(key)
  })

  ipcMain.handle('config:set', (_, key: ConfigKey, value: ConfigValue) => {
    return configService?.set(key, value)
  })

  ipcMain.handle('replays:get', (_, page?: number, take?: number) => {
    return replayService.getReplays(page, take)
  })

  // ipcMain.handle('replays:forceScan', () => {
  //   return replayService.forceScan()
  // })

  // ipcMain.handle('replays:list', (_, page?: number, take?: number) => {
  //   return replayService.list(page, take)
  // })

  // ipcMain.handle('players:claim', (_, name: string) => {
  //   return PlayerService.claim(name)
  // })

  // ipcMain.handle('players:getClaimed', () => {
  //   return PlayerService.getClaimed()
  // })

  // ipcMain.handle('players:getAll', () => {
  //   return PlayerService.getAllPlayers()
  // })

  replayService.on('replay:imported', (replay: Replay) => {
    mainWindow?.webContents.send('replay:imported', replay)
  })

  replayService.on('import:start', (total: number) => {
    mainWindow?.webContents.send('import:start', total)
  })

  replayService.on('import:progress', (progress: Progress) => {
    mainWindow?.webContents.send('import:progress', progress)
  })

  replayService.on('import:complete', () => {
    mainWindow?.webContents.send('import:complete')
  })

  mainWindow.on('closed', () => {
    logger.info('main', 'Main window closed')

    mainWindow = null
  })
}

app
  .whenReady()
  .then(createWindow)
  .catch((err) => {
    logger.error('electron.error', err)
    process.exit(0)
  })

app.on('window-all-closed', () => {
  logger.info('main', 'All windows closed')
  app.quit()
})
