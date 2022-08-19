import { ipcRenderer } from 'electron'
import { ConfigKey, Theme } from './types'
import { Intl, Paged, Replay, ReplayEntity, Sort } from './types'

const { invoke } = ipcRenderer

export type ReplayFileCount = {
  file: string
  count: number
}

const api = {
  on: <T = never>(
    event: string,
    listener: (event: unknown, ...args: T[]) => void
  ) => {
    ipcRenderer.on(event, listener)
  },

  off: <T = never>(
    event: string,
    listener: (event: unknown, ...args: T[]) => void
  ) => {
    ipcRenderer.removeListener(event, listener)
  },

  window: {
    close: () => invoke('window:close'),
    maximize: () => invoke('window:maximize'),
    minimize: () => invoke('window:minimize'),
    unmaximize: () => invoke('window:unmaximize'),
  },

  config: {
    get: <T>(key: ConfigKey) => invoke('config:get', key) as Promise<T>,
    set: <T>(key: ConfigKey, value: T): Promise<void> => {
      return invoke('config:set', key, value)
    },
  },

  themes: {
    get: () => invoke('themes:get') as Promise<Theme>,
  },

  dialog: {
    openDirectory: (): Promise<string[]> => invoke('dialog:openDirectory'),
  },

  replays: {
    getDefaultDirectory: (): Promise<string> =>
      invoke('replays:getDefaultDirectory'),
    get: (
      page?: number,
      take?: number,
      sort?: Sort<ReplayEntity>
    ): Promise<Paged<Replay>> => {
      return invoke('replays:get', page, take, sort)
    },
  },

  players: {
    // claim: (playerName: string) => invoke('players:claim', playerName),
    // getClaimed: (): Promise<Omit<Player, 'stats'>[]> => {
    //   return invoke('players:getClaimed')
    // },
    // getAll: (): Promise<Player[]> => {
    //   return invoke('players:getAll')
    // },
  },

  intl: {
    get: (): Promise<Intl | undefined> => invoke('intl:get'),
  },
} as const

export default api
export type Api = typeof api
