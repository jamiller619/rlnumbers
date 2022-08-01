import { UserConfig } from 'vite'
import merge, { getNodeVersion } from '../../vite.config.shared'

const config: UserConfig = {
  root: __dirname,
  build: {
    target: getNodeVersion(),
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'index.cjs',
    },
  },
}

export default merge(config)
