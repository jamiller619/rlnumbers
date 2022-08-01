import { Api } from '@shared/api'

declare global {
  export interface Window {
    api?: Api
  }
}
