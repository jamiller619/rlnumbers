import EventEmitter from 'node:events'
import Store from 'electron-store'
import { ColorMode } from '@shared/enums'
import type { Config, ConfigKey } from '@shared/types'
import logger from '~/utils/logger'

const store = new Store<Config>({
  name: 'config',
  defaults: {
    dirs: null,
    rrrocketVersion: '0.9.3',
    theme: {
      name: 'system.default',
      colors: {
        mode: ColorMode.AUTO,
      },
    },
  },
})

logger.debug('config.service', `Loaded config "${store.path}"`)
logger.debug(
  'config.service',
  `Config: ${JSON.stringify(store.store, null, 2)}`
)

const emitter = new EventEmitter()

export const on = emitter.on.bind(emitter)
export const off = emitter.off.bind(emitter)
export const emit = emitter.emit.bind(emitter)

export const getConfig = () => ({ ...store.store })
// @ts-ignore: This works...
export const get = <T>(key: ConfigKey) => store.get(key) as T

export const set = <T>(key: ConfigKey, value: T) => {
  try {
    store.set(key, value)

    logger.debug('config.set', `Config updated: "${key}": "${value}"`)

    emitter.emit('change', getConfig())
  } catch (err) {
    logger.error('config.set', `Unable to set "${key}": ${value}`, err)
  }
}
