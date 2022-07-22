import path from 'node:path'
import * as chokidar from 'chokidar'
import klaw from 'klaw'
import logger from '~/utils/logger'
import { deleteReplay, importReplays } from './replay.service'

let watcher: chokidar.FSWatcher | null = null

const isReplay = (file: string) => file.endsWith('.replay')

const getReplayFiles = async (...dirs: string[]) => {
  const files = []

  for (const dir of dirs) {
    for await (const file of klaw(dir)) {
      if (isReplay(file.path)) {
        files.push(file.path)
      }
    }
  }

  return files
}

export const watch = async (...dirs: string[]) => {
  if (dirs.length < 1) {
    throw new Error('No directories specified to watch')
  }

  if (watcher != null) {
    logger.info('replay.watcher', 'Closing existing watcher...')

    await watcher.close()
  }

  const paths = dirs.map((dir) => `${path.normalize(dir)}/**/*.replay`)

  watcher = chokidar.watch(paths, {
    ignoreInitial: true,
  })

  watcher.on('ready', async () => {
    const files = await getReplayFiles(...dirs)

    await importReplays(...files)
  })

  watcher.on('add', async (file) => {
    if (isReplay(file)) {
      await importReplays(file)
    }
  })

  watcher.on('unlink', async (file) => {
    if (isReplay(file)) {
      await deleteReplay(file)
    }
  })

  watcher.on('error', (err) =>
    logger.error('replay.watcher', `Error event fired`, err)
  )

  logger.info('replay.watcher', 'Watching for new replays...')
}
