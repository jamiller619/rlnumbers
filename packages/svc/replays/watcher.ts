import path from 'node:path'
import type { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import { ImportQueueService } from '@rln/api/services'
import logger from '@rln/shared/logger'
import getReplayFiles from './getReplayFiles'
import isReplay from './isReplay'

let watcher: FSWatcher | null = null
const importQueueService = new ImportQueueService()

const stop = async () => {
  if (watcher) {
    logger.info('replay.watcher', 'Closing watcher...')

    await watcher.close()
    watcher = null

    logger.info('replay.watcher', 'Closed watcher')
  }
}

export default async function watch(...dirs: string[]) {
  await stop()

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
      logger.error('replay.watcher', `Error event fired`, err)
    )

    logger.info('replay.watcher', 'Watching for new replays...')
  } catch (err) {
    logger.error('replay.watcher', 'Unknown error', err)
  }
}
