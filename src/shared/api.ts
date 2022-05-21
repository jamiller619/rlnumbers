import { ipcRenderer } from 'electron'
import { Config, Replay } from './types'

const { invoke } = ipcRenderer

const api = {
  on: <T = never>(
    event: string,
    listener: (event: unknown, ...args: T[]) => void
  ) => {
    ipcRenderer.addListener(event, listener)
  },

  off: <T = never>(
    event: string,
    listener: (event: unknown, ...args: T[]) => void
  ) => {
    ipcRenderer.removeListener(event, listener)
  },

  config: {
    get: (): Promise<Config> => invoke('config:get'),
    set: (key: keyof Config, value: unknown): Promise<Config> => {
      return invoke('config:set', key, value)
    },
  },

  dialog: {
    openDirectory: () => invoke('dialog:openDirectory'),
  },

  replays: {
    import: (dir: string): Promise<void> => invoke('replays:import', dir),
    get: (page?: number, take?: number): Promise<Replay[]> => {
      return invoke('replays:get', page, take)
    },
  },
} as const

export default api
export type Api = typeof api
