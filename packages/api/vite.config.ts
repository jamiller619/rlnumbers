import { UserConfig } from 'vite'
import { dirname, getNodeVersion, merge } from '@rln/shared/vite'
import pkg from './package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(),
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName: 'index',
    },
  },
}

export default merge(config, pkg, 'api')
