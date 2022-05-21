import { builtinModules } from 'node:module'
import { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from '../../package.json'

// Allow importing node modules with the prefix "node:"
const nodePrefixedModules = builtinModules.map((name) => `node:${name}`)

const config: UserConfig = {
  root: __dirname,
  plugins: [tsconfigPaths()],
  build: {
    outDir: '../../dist',
    minify: process.env.NODE_ENV === 'production',
    sourcemap: true,
    rollupOptions: {
      external: [
        ...nodePrefixedModules,
        ...builtinModules,
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'index.cjs',
    },
  },
}

export default config
