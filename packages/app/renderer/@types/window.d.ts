import { Api } from '@rln/shared/api'

declare global {
  export interface Window {
    api?: Api
  }
}
