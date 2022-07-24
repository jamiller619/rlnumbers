import { UserConfig } from 'vite'
import merge from '../../vite.config.shared'

const config: UserConfig = {
  root: __dirname,
  build: {
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'index.cjs',
    },
  },
}

export default merge(config)
