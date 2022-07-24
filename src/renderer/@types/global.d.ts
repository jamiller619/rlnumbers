import { Api } from '@shared/api'
import { State } from '~/store/useState'

declare global {
  interface Window {
    api?: Api
    getState: () => State
  }
}

export {}
