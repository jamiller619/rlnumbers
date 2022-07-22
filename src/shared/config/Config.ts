import config from './config.json'

type Config = Omit<typeof config, 'dirs'> & {
  readonly dirs: string[]
}

export default Config

export const defaultConfig = config

export type Theme = 'light' | 'dark' | 'auto'

export type ConfigKey = keyof Config
export type ConfigValue = Config[ConfigKey]
