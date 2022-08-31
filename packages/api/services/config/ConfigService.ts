import Store from 'electron-store'
import logger from 'logger'
import type { Config, ConfigKey } from '@rln/shared/types'
import { TypedEmitter } from '@rln/shared/types'
import defaultConfig from './default.json'

type ConfigServiceEvent = {
  change: (config: Config) => void
}

export default class ConfigService extends TypedEmitter<ConfigServiceEvent> {
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

  public get<T>(key: ConfigKey) {
    // @ts-ignore: This works...
    return this.#store.get(key) as T
  }

  public getConfig() {
    return { ...this.#store.store }
  }

  public set<T>(key: ConfigKey, value: T) {
    try {
      this.#store.set(key, value)

      logger.debug('config.set', `Config updated: "${key}": "${value}"`)

      this.emit('change', this.getConfig())
    } catch (err) {
      logger.error('config.set', `Unable to set "${key}": ${value}`, err)
    }
  }
}
