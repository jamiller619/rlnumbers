import { UserConfig } from 'vite'
import { dirname, getNodeVersion, merge } from '@rln/shared/vite.js'
import pkg from './package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(),
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
}

export default merge(config, pkg, 'svc')
