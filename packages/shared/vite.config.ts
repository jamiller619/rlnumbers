import { builtinModules } from 'node:module'
import path, { dirname as ndirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import deepmerge from 'deepmerge'
import { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export const dirname = (importMetaUrl: string) =>
  ndirname(fileURLToPath(importMetaUrl))

// Allow importing node modules with the "node" prefix, i.e. "import path from 'node:path'".
const nodePrefixedModules = builtinModules.map((name) => `node:${name}`)

type PackageJSON = {
  [key: string]: unknown
  devDependencies: Record<string, string>
  dependencies: Record<string, string>
}

// [electron]: [node]
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

// [electron]: [chrome]
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

const getElectronVersion = (pkg: PackageJSON) => {
  return pkg.dependencies['electron'].replace('^', '').split('.')[0]
}

export const getNodeVersion = (pkg: PackageJSON) => {
  const electronVer = getElectronVersion(pkg)

  if (electronVer != null) {
    return `node${nodeVersionMap[electronVer]}`
  }

  return ''
}

export const getChromeVersion = (pkg: PackageJSON) => {
  const electronVer = getElectronVersion(pkg)

  if (electronVer != null) {
    return `chrome${chromeVersionMap[electronVer]}`
  }

  return ''
}

const here = dirname(import.meta.url)
const root = path.join(here, '../../')

const createConfig = (pkg: PackageJSON): UserConfig => {
  return {
    root,
    plugins: [
      tsconfigPaths({
        root: './',
      }),
    ],
    build: {
      outDir: path.join(root, 'dist/app'),
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
}

export default function merge(config: UserConfig, pkg: PackageJSON) {
  return deepmerge(createConfig(pkg), config)
}
