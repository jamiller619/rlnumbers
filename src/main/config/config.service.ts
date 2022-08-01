import EventEmitter from 'node:events'
import Store from 'electron-store'
import { Theme } from '@shared/enums'
import type { Config, ConfigValue } from '@shared/types'
import logger from '~/utils/logger'

const store = new Store<Config>({
  accessPropertiesByDotNotation: false,
  name: 'config',
  defaults: {
    dirs: null,
    rrrocketVersion: '0.9.3',
    theme: Theme.auto,
  },
})

const emitter = new EventEmitter()

export const on = emitter.on.bind(emitter)
export const off = emitter.off.bind(emitter)
export const emit = emitter.emit.bind(emitter)

export const getConfig = () => {
  return store.store
}

export const get = <T extends ConfigValue>(key: keyof Config) => {
  return store.get(key) as T
}

export const set = async <T extends ConfigValue>(
  key: keyof Config,
  value: T
) => {
  try {
    store.set(key, value)

    logger.debug('config.set', `Config updated: "${key}": "${value}"`)

    emitter.emit('change', store.store)
  } catch (err) {
    logger.error('config.set', 'Unable to save config', err)
  }
}
