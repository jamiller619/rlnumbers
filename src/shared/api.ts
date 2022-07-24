// import { Player } from '@prisma/client'
import { ipcRenderer } from 'electron'
import { Config, ConfigKey, ConfigValue } from './config'
import { Intl, Paged, Replay, ReplayEntity, Sort } from './types'

const { invoke } = ipcRenderer

const api = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, listener: (event: unknown, ...args: any[]) => void) => {
    ipcRenderer.on(event, listener)
  },

  off: <T = never>(
    event: string,
    listener: (event: unknown, ...args: T[]) => void
  ) => {
    ipcRenderer.removeListener(event, listener)
  },

  config: {
    get: (key?: ConfigKey) => invoke('config:get', key),
    set: (key: ConfigKey, value: ConfigValue): Promise<Config> => {
      return invoke('config:set', key, value)
    },
  },

  dialog: {
    openDirectory: () => invoke('dialog:openDirectory'),
  },

  replays: {
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
