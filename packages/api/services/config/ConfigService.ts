import EventEmitter from 'node:events'
import Store from 'electron-store'
import logger from 'logger'
import TypedEmitter from 'typed-emitter'
import type { Config, ConfigKey } from '@rln/shared/types'
import defaultConfig from './default.json'

export type ConfigServiceEvent = {
  change: (config: Config) => void
}

export default class ConfigService extends (EventEmitter as new () => TypedEmitter<ConfigServiceEvent>) {
  #store: Store<Config>

  constructor() {
    super()

    this.#store = new Store<Config>({
      name: 'config',
      defaults: defaultConfig as Config,
    })

    logger.debug('config.service', `Loaded config "${this.#store.path}"`)
    logger.debug(
      'config.service',
      `Config: ${JSON.stringify(this.#store.store, null, 2)}`
    )
  }

  getConfig() {
    return { ...this.#store.store }
  }

  get<T>(key: ConfigKey) {
    // @ts-ignore: This works...
    return this.#store.get(key) as T
  }

  set<T>(key: ConfigKey, value: T) {
    try {
      this.#store.set(key, value)

      logger.debug('config.set', `Config updated: "${key}": "${value}"`)

      this.emit('change', this.getConfig())
    } catch (err) {
      logger.error('config.set', `Unable to set "${key}": ${value}`, err)
    }
  }
}
