import { Service } from 'node-windows'
import logger from '@rln/shared/logger'

export default function install(node: string) {
  const svc = new Service({
    name: 'RLN Replay Watcher',
    description: 'RLN Replay Watch Service',
    script: './replays/watcher.js',
  })

  svc.on('install', () => {
    logger.info('watch.svc', 'Replay Watcher service installed')
  })

  svc.install()
}
