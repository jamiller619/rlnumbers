import { join } from 'node:path'
import { versions } from 'node:process'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { ConfigService, ReplayService } from '@rln/api/services'
import logger from '@rln/shared/logger'
import {
  ConfigKey,
  Progress,
  Replay,
  ReplayEntity,
  Sort,
} from '@rln/shared/types'
import wait from '@rln/shared/utils/wait'
import { isDev } from '~/config'
import { themeService } from './themes'

logger.info('main', `Starting main process in ${isDev ? 'DEV' : 'PROD'} mode`)

if (isDev) {
  logger.debug(
    'main',
    `running Electron v${versions.electron} w/Chrome v${versions.chrome}`
  )
}

let mainWindow: BrowserWindow | null = null
const configService = new ConfigService()
const replayService = new ReplayService()

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
      webPreferences: {
        nodeIntegration: false, // default in Electron >= 5
        contextIsolation: true, // default in Electron >= 12

        // turned on, ONLY in DEV, to allow loading of local
        // files (images) when using the dev server
        webSecurity: isDev ? false : true,
        preload: join(__dirname, 'preload.cjs'),
      },
    })

  mainWindow.once('ready-to-show', async () => {
    mainWindow?.show()

    await wait(5)

    replayWatcher.start()
  })

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`)

    wait(1).then(() => mainWindow?.webContents.openDevTools())
  } else {
    mainWindow.loadFile(join(__dirname, 'index.html'))
  }

  ipcMain.handle('dialog:openDirectory', async () => {
    if (mainWindow != null) {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })

      return canceled ? undefined : filePaths
    }
  })

  ipcMain.handle('config:get', (_, key: ConfigKey) => {
    return configService.get(key)
  })

  ipcMain.handle('config:set', <T>(_: unknown, key: ConfigKey, value: T) => {
    return configService.set(key, value)
  })

  ipcMain.handle('themes:get', () => themeService.get())

  ipcMain.handle(
    'replays:get',
    (_, page?: number, take?: number, sort?: Sort<ReplayEntity>) => {
      return replayService.getReplays(page, take, sort)
    }
  )

  ipcMain.handle('window:close', () => mainWindow?.close())
  ipcMain.handle('window:maximize', () => mainWindow?.maximize())
  ipcMain.handle('window:minimize', () => mainWindow?.minimize())
  ipcMain.handle('window:unmaximize', () => mainWindow?.unmaximize())

  ipcMain.handle('replays:getDefaultDirectory', () => {
    return replayService.getDefaultDirectory()
  })

  // ipcMain.handle(
  //   'replays:countDirectory',
  //   async (_: unknown, ...dirs: string[]) => {
  //     for await (const count of replayService.countReplayFiles(...dirs)) {
  //       mainWindow?.webContents.send('replay:count', count)
  //     }
  //   }
  // )

  ipcMain.handle('intl:get', async () => {
    const { intlService } = await import('~/intl')

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
  })

app.on('window-all-closed', () => {
  logger.info('main', 'Terminating application')

  app.quit()
})

// May not be entirely necessary for this app, but it gets
// rid of the annoying "ERROR:gpu_init.cc] Passthrough is
// not supported" error from appearing in the console. To
// get rid of that error, we can either turn on gpu
// rendering, or turn it off. I chose to have it on.
app.commandLine.appendSwitch('force_high_performance_gpu')
