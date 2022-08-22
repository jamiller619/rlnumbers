import { UserConfig } from 'vite'
import pkg from '../app/package.json'
import merge, { dirname, getNodeVersion } from '../shared/vite.config.js'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(pkg),
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'index.cjs',
    },
  },
}

export default merge(config, pkg)
