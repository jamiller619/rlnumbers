import { builtinModules } from 'node:module'
import process from 'node:process'
import deepmerge from 'deepmerge'
import { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from './package.json'

// Allow importing node modules with the "node" prefix, i.e. "import path from 'node:path'".
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

const getElectronVersion = () => {
  return pkg.dependencies['electron'].replace('^', '').split('.')[0]
}

export const getNodeVersion = () => {
  const nodeVersionMap: Record<string, string> = {
    '21': '16.15',
    '20': '16.15',
    '19': '16.14',
    '18': '16.13',
    '17': '16.13',
    '16': '16.9',
    '15': '16.5',
    '14': '14.17',
    '13': '14.17',
    '12': '14.16',
    '11': '12.18',
  }

  const electronVer = getElectronVersion()

  if (electronVer != null) {
    return `node${nodeVersionMap[electronVer]}`
  }

  return ''
}

export const getChromeVersion = () => {
  const chromeVersionMap: Record<string, string> = {
    '21': '107',
    '20': '107',
    '19': '106',
    '18': '100',
    '17': '98',
    '16': '96',
    '15': '94',
    '14': '93',
    '13': '91',
    '12': '89',
    '11': '87',
  }

  const electronVer = getElectronVersion()

  if (electronVer != null) {
    return `chrome${chromeVersionMap[electronVer]}`
  }

  return ''
}

export default function merge(config: UserConfig) {
  return deepmerge(shared, config)
}
