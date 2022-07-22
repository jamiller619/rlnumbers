import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Config, ConfigKey, ConfigValue, defaultConfig } from '@shared/config'
import logger from '~/utils/logger'

const { ROOT } = process.env

const filePath = path.resolve(ROOT, 'config.json')
let config: Config | null = null

const writeToFile = async (data: Config) => {
  await fs.writeFile(filePath, JSON.stringify(data), 'utf8')
}

export const getConfig = async () => {
  if (config != null) {
    return config
  }

  try {
    const data = await fs.readFile(filePath, 'utf8')

    config = JSON.parse(data) as Config
  } catch {
    await writeToFile(defaultConfig)

    config = defaultConfig
  }

  return config
}

export const get = async (key?: ConfigKey) => {
  const data = await getConfig()

  return key ? data[key] : data
}

export const set = async (key: ConfigKey, value: ConfigValue) => {
  try {
    const oldConfig = await getConfig()
    const newConfig: Config = {
      ...oldConfig,
      [key]: value,
    }

    await writeToFile(newConfig)

    config = newConfig
  } catch (err) {
    logger.error('config.save', err)

    throw err
  }

  return config
}
