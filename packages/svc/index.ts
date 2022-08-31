import logger from 'logger'
import { Service } from 'node-windows'
import ConfigService from '@rln/api/services/config/ConfigService.js'
import type { DirConfig } from '@rln/shared/types'
import replayWatcher from './replays/watcher.js'

type Action = 'start' | 'stop' | 'install' | 'uninstall'

const action = process.argv?.[2] as Action

if (action == null) {
  throw new Error('Missing required action!')
}

const configService = new ConfigService()
const filterDirs = (dirs: DirConfig[]) => {
  return dirs.filter((dir) => dir.watch === true).map((dir) => dir.path)
}

const dirs = filterDirs(configService.get('dirs'))

const svc = new Service({
  name: 'RLN Replay Watcher',
  description: 'RLN Replay Watch Service',
  script: './replays/watcher.js',
})

svc.on('install', () => {
  replayWatcher.start(...dirs)

  logger.info('replay.service', 'Replay watch service installed successfully')
})

svc.on('uninstall', () => {
  replayWatcher.stop()

  logger.info(
    'replay.service',
    'Replay Watcher service uninstalled successfully'
  )
})

configService.on('change', (newConfig) => {
  replayWatcher.start(...filterDirs(newConfig.dirs))
})

let actionText = ''

switch (action) {
  case 'install':
    svc.install()
    actionText = 'installed'
    break

  case 'start':
    await replayWatcher.start(...dirs)
    actionText = 'started'
    break

  case 'stop':
    await replayWatcher.stop()
    actionText = 'stopped'
    break

  case 'uninstall':
    svc.uninstall()
    actionText = 'uninstalled'
    break

  default:
    throw new Error(`Invalid action "${action}"`)
}

// keep alive!
await new Promise(() =>
  logger.info('replay.service', `Successfully ${actionText} the watch service!`)
)
