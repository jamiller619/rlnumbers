import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import merge, { getChromeVersion } from '../../vite.config.shared'

const config: UserConfig = {
  root: __dirname,
  plugins: [react()],
  build: {
    target: getChromeVersion(),
    outDir: '../../dist',
    polyfillModulePreload: false,
  },
}

export default merge(config)
