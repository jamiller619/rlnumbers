import path from 'node:path'
import type { FSWatcher } from 'chokidar'
import { Config } from '@shared/types'
import { configService } from '~/config'
import logger from '~/utils/logger'

let watcher: FSWatcher | null = null

const watch = async (...dirs: string[]) => {
  if (dirs.length < 1) {
    throw new Error('No directories specified to watch')
  }

  const { default: chokidar } = await import('chokidar')
  const replayService = await import('~/replays/replay.service')

  await stop()

  const paths = dirs.map((dir) => path.normalize(`${dir}/**/*.replay`))

  try {
    watcher = chokidar.watch(paths, {
      ignoreInitial: true,
    })

    watcher.on('ready', async () => {
      const files = []

      for await (const file of replayService.getReplayFiles(...dirs)) {
        files.push(file)
      }

      // await replayService.importReplays(...files)
    })

    watcher.on('add', async (file) => {
      if (replayService.isReplay(file)) {
        await replayService.importReplays(file)
      }
    })

    watcher.on('unlink', async (file) => {
      if (replayService.isReplay(file)) {
        await replayService.deleteReplay(file)
      }
    })

    watcher.on('error', (err) =>
      logger.error('replay.watcher', `Error event fired`, err)
    )

    logger.info('replay.watcher', 'Watching for new replays...')
  } catch (err) {
    logger.error('replay.watcher', 'Unknown error', err)
  }
}

export const stop = async () => {
  if (watcher != null) {
    logger.info('replay.watcher', 'Closing watcher...')

    await watcher.close()
  }

  watcher = null
}

export const start = () => {
  const config = configService.getConfig()

  configService.on('change', (newConfig: Config) => {
    if (newConfig.dirs && newConfig.dirs.length > 0) {
      watch(...newConfig.dirs)
    }
  })

  if (!config.dirs || config.dirs.length === 0) {
    logger.info('main', 'No replay directories configured.')
  } else {
    watch(...config.dirs)
  }
}
