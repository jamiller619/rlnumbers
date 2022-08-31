import logger from 'logger'
import { Service } from 'node-windows'
import { replayWatcher } from './replays'

type Action = 'start' | 'stop' | 'install' | 'uninstall'

if (process.argv?.[2] == null) {
  throw new Error('Missing required action param!')
}

const action = process.argv[2] as Action

const svc = new Service({
  name: 'RLN Replay Watcher',
  description: 'RLN Replay Watch Service',
  script: './replays/watcher.js',
})

svc.on('install', () => {
  replayWatcher.start()

  logger.info('watch.svc', 'Replay watch service installed successfully')
})

svc.on('uninstall', () => {
  replayWatcher.stop()

  logger.info('watch.svc', 'Replay Watcher service uninstalled successfully')
})

switch (action) {
  case 'install':
    svc.install()
    break

  case 'start':
    replayWatcher.start()
    break

  case 'stop':
    replayWatcher.stop()
    break

  case 'uninstall':
    svc.uninstall()
    break

  default:
    throw new Error(`Invalid action "${action}"`)
}
