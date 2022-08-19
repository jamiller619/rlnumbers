import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import merge, { dirname, getChromeVersion } from '../../shared/vite.config.js'
import pkg from '../package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  plugins: [react()],
  build: {
    target: getChromeVersion(pkg),
    polyfillModulePreload: false,
  },
}

export default merge(config, pkg)
