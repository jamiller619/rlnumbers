import path from 'node:path'
import appRoot from 'app-root-dir'
import logger from 'logger'
import exec from '~/utils/exec'

const root = appRoot.get()

const bins = {
  win: 'rrrocket.exe',
  mac: 'rrrocket-apple-darwin.tar',
  linux: 'rrrocket-linux.tar',
}

const getBin = () => {
  switch (process.platform) {
    case 'darwin':
      return bins.mac

    case 'linux':
      return bins.linux

    default:
      return bins.win
  }
}

export const exe = path.resolve(root, '/bin', getBin())

export const getVersion = async () => {
  const { stdout } = await exec(`${exe} --version`)
  const version = stdout.replace('rrrocket', '').trim()

  logger.info('rrrocket', `Using rrrocket v${version}`)

  return version
}
