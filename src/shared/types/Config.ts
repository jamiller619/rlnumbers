export type Theme = 'light' | 'dark' | 'auto'

const config = {
  theme: 'auto',
  ['scan.interval']: 5,
  ['scan.enabled']: true,
}

type Config = typeof config & {
  readonly dirs?: string[]
}

export { Config as default, config as defaultConfig }
