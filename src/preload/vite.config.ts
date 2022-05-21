import { UserConfig } from 'vite'
import shared from '../../vite.config.shared'

const config: UserConfig = {
  ...shared,
  root: __dirname,
  build: {
    ...shared.build,
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'preload.cjs',
    },
  },
}

export default config
