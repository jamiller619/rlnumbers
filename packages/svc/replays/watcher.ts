import path from 'node:path'
import type { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import logger from 'logger'
import { ImportQueueService } from '@rln/api/services'
import getReplayFiles from './getReplayFiles'
import isReplay from './isReplay'

let watcher: FSWatcher | null = null
const importQueueService = new ImportQueueService()

export const stop = async () => {
  if (watcher) {
    logger.info('replay.service', 'Closing watcher...')

    await watcher.close()
    watcher = null

    logger.info('replay.service', 'Closed watcher')
  }
}

export const start = async (...dirs: string[]) => {
  await stop()

  if (dirs.length === 0) {
    logger.info(
      'replay.service',
      'No valid directories to watch, keeping watcher closed.'
    )

    return
  }

  const paths = dirs.map((dir) => path.normalize(`${dir}/**/*.replay`))

  try {
    watcher = chokidar.watch(paths, {
      ignoreInitial: true,
    })

    watcher.on('ready', async () => {
      for await (const dir of dirs) {
        const files = await getReplayFiles(dir)

        if (files && files.length > 0) {
          await importQueueService.add(...files)
        }
      }
    })

    watcher.on('add', async (file) => {
      if (isReplay(file)) {
        await importQueueService.add(file)
      }
    })

    watcher.on('unlink', async (file) => {
      if (isReplay(file)) {
        await importQueueService.remove(file)
      }
    })

    watcher.on('error', (err) =>
      logger.error('replay.service', `Error event fired`, err)
    )

    logger.info('replay.service', 'Watching for new replays...')
  } catch (err) {
    logger.error('replay.service', 'Unknown error', err)
  }
}

export default {
  start,
  stop,
}
