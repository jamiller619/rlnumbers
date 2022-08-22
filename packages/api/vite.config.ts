import { UserConfig } from 'vite'
import rootPkg from '../app/package.json'
import merge, { dirname, getNodeVersion } from '../shared/vite.config.js'
import pkg from './package.json'

const config: UserConfig = {
  root: dirname(import.meta.url),
  build: {
    target: getNodeVersion(rootPkg),
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
}

export default merge(
  config,
  {
    dependencies: {
      ...rootPkg.dependencies,
      ...pkg.dependencies,
    },
    devDependencies: {
      ...rootPkg.devDependencies,
      ...pkg.dependencies,
    },
  },
  'api'
)
