import { UserConfig } from 'vite'
import { dirname, getNodeVersion, merge } from '@rln/shared/vite.js'
import pkg from '../package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(),
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: 'preload',
    },
  },
}

export default merge(config, pkg, 'app')
