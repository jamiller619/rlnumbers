import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import { dirname, getChromeVersion, merge } from '@rln/shared/vite.js'
import pkg from '../package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  plugins: [react()],
  build: {
    target: getChromeVersion(),
  },
}

export default merge(config, pkg, 'app')
