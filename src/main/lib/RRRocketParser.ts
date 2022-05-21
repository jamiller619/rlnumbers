import { exec as cp_exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import * as RRRocket from './RRRocket'

const exec = promisify(cp_exec)
const { RRROCKET_VERSION } = process.env

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

const isWindows = process.platform === 'win32'

export default class RRRocketParser {
  exe: string
  opts = {
    maxBuffer: 1024 * 1000,
  }

  constructor() {
    const bin = getBin()

    this.exe = path.resolve(
      __dirname,
      '../src/main/bin',
      `rrrocket-v${RRROCKET_VERSION}`,
      bin
    )
  }

  async parseReplay(filePath: string) {
    const file = isWindows
      ? filePath.split(path.sep).join(path.posix.sep)
      : filePath

    const cmd = `${this.exe} -j "${file}"`
    const { stdout, stderr } = await exec(cmd, this.opts)

    if (stderr) {
      throw stderr
    }

    return JSON.parse(stdout.toString()) as RRRocket.Replay
  }
}
