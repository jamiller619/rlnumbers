import path from 'node:path'
import process from 'node:process'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { Config, ConfigKey, ConfigValue } from '@shared/config'
import { Progress, Replay, ReplayEntity, Sort } from '@shared/types'
import wait from '@shared/utils/wait'
import logger from '~/utils/logger'
import * as configService from './config/config.service'
import * as intlService from './intl/intl.service'
import * as replayService from './replays/replay.service'
import * as replayWatcher from './replays/replay.watcher'

const isDev = process.env.NODE_ENV === 'development'

logger.info('main', `Starting main process in ${isDev ? 'DEV' : 'PROD'} mode`)

let mainWindow: BrowserWindow | null = null

const initApp = async () => {
  const config = await configService.getConfig()

  if (config.dirs.length === 0) {
    logger.info('main', 'No replay directories configured.')
  } else {
    replayWatcher.watch(...config.dirs)
  }
}

const createWindow = () => {
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

    await initApp()
  })

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`)

    wait(1).then(() => mainWindow?.webContents.openDevTools())
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

  ipcMain.handle(
    'replays:get',
    (_, page?: number, take?: number, sort?: Sort<ReplayEntity>) => {
      return replayService.getReplays(page, take, sort)
    }
  )

  ipcMain.handle('intl:get', () => {
    return intlService.getIntl()
  })

  replayService.on('replay:imported', (replay: Replay) => {
    mainWindow?.webContents.send('replay:imported', replay)
  })

  replayService.on('replay:deleted', (id: number) => {
    mainWindow?.webContents.send('replay:deleted', id)
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

    process.exitCode = 1
  })

app.on('window-all-closed', () => {
  logger.info('main', 'Terminating application')

  process.exitCode = 1
})

// May not be entirely necessary for this app, but it gets
// rid of the annoying "ERROR:gpu_init.cc] Passthrough is
// not supported" error from appearing in the console. To
// get rid of that error, we can either turn on gpu
// rendering, or turn it off. I chose to have it on.
app.commandLine.appendSwitch('force_high_performance_gpu')
