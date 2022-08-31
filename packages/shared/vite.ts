import { builtinModules } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { externalize } from 'build-tools/vite'
import deepmerge from 'deepmerge'
import { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import rootPkgJSON from '../../package.json'
import apiPkgJSON from '../api/package.json'
import appPkgJSON from '../app/package.json'
import sharedPkgJSON from '../shared/package.json'

export const dirname = (importMetaUrl: string) => {
  return path.dirname(fileURLToPath(importMetaUrl))
}

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

const getElectronVersion = () => {
  return appPkgJSON.dependencies['electron'].replace('^', '').split('.')[0]
}

export const getNodeVersion = () => {
  const electronVer = getElectronVersion()

  if (electronVer != null) {
    return `node${nodeVersionMap[electronVer]}`
  }

  return ''
}

export const getChromeVersion = () => {
  const electronVer = getElectronVersion()

  if (electronVer != null) {
    return `chrome${chromeVersionMap[electronVer]}`
  }

  return ''
}

const here = dirname(import.meta.url)
const root = path.join(here, '../../')

const createConfig = (
  pkg: PackageJSON,
  app: string,
  mode: 'dev' | 'prod'
): UserConfig => {
  return {
    root,
    plugins: [
      tsconfigPaths({
        root,
      }),
    ],
    mode: mode === 'prod' ? 'production' : 'development',
    build: {
      outDir: path.join(root, 'dist', app),
      minify: mode === 'prod',
      sourcemap: true,
      rollupOptions: {
        external: [
          ...externalize(
            rootPkgJSON.devDependencies,
            rootPkgJSON.dependencies,
            pkg.devDependencies,
            pkg.dependencies,
            apiPkgJSON.dependencies,
            sharedPkgJSON.dependencies
          ),
          ...builtinModules,
        ],
      },
    },
  }
}

export const merge = (config: UserConfig, pkg: PackageJSON, app = 'app') => {
  const result = deepmerge(createConfig(pkg, app, 'dev'), config)

  // console.info(`\nmerged config for ${app}:`)
  // console.info(JSON.stringify(result, null, 2))

  return result
}
