import EventEmitter from 'node:events'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import * as chokidar from 'chokidar'
import { Config, defaultConfig } from '@shared/types'

const { ROOT } = process.env
const FILE_PATH = path.resolve(ROOT, 'config.json')

const watcher = chokidar.watch(FILE_PATH)

const getConfig = async () => {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf8')

    return JSON.parse(file) as Config
  } catch {
    return defaultConfig
  }
}

// The methods on this class would have been made static,
// but it's conceivable we'll want to do some bootstrap in
// the constructor, in the future.
export default class ConfigService extends EventEmitter {
  #config!: Config

  constructor() {
    super()

    this.#loadConfig().then(() => {
      this.emit('ready', this.#config)
    })

    watcher.removeAllListeners('change')
    watcher.on('change', this.#broadcastChanges.bind(this))
  }

  async #broadcastChanges() {
    const oldConfig = {
      ...this.#config,
    }

    await this.#loadConfig()

    const keys = Object.keys(this.#config) as (keyof Config)[]

    const diffs = keys.filter((key) => {
      return this.#config[key] !== oldConfig[key]
    })

    for (const diff of diffs) {
      const value = this.#config[diff]

      this.emit(`config:${diff}:change`, value)
    }
  }

  async #loadConfig() {
    this.#config = await getConfig()
  }

  get() {
    return this.#config
  }

  async set<T>(key: keyof Config, value: T) {
    const newConfig = {
      ...this.#config,
      [key]: value,
    }

    await fs.writeFile(FILE_PATH, JSON.stringify(newConfig, null, 2))

    return newConfig
  }
}
