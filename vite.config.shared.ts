import { builtinModules } from 'node:module'
import { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from './package.json'

// Allow importing node modules with the prefix "node:"
const nodePrefixedModules = builtinModules.map((name) => `node:${name}`)

const shared: UserConfig = {
  plugins: [tsconfigPaths()],
  build: {
    outDir: '../../dist',
    minify: process.env.NODE_ENV !== 'development',
    sourcemap: true,
    rollupOptions: {
      external: [
        ...nodePrefixedModules,
        ...builtinModules,
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
}

// export default shared
export default function merge(config: UserConfig) {
  return {
    ...config,
    ...shared,
    plugins: [...(config.plugins ?? []), ...(shared.plugins ?? [])],
    build: {
      ...config.build,
      ...shared.build,
    },
  }
}
