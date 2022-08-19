import { UserConfig } from 'vite'
import merge, { getNodeVersion } from '@rln/shared/vite.config'
import pkg from './package.json'

const config: UserConfig = {
  root: __dirname,
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
