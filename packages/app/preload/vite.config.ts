import { UserConfig } from 'vite'
import merge, { dirname, getNodeVersion } from '../../shared/vite.config.js'
import pkg from '../package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(pkg),
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'preload.cjs',
    },
  },
}

export default merge(config, pkg)
