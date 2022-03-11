import chalk from 'chalk'
import { exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import Replay from '~/replays/Replay'

const RRRocketVersion = '0.9.3'
const bins = {
  win: 'rrrocket.exe',
  mac: 'rrrocket-apple-darwin.tar',
  linux: 'rrrocket-linux.tar',
}

const getBin = () => {
  switch (process.platform) {
    case 'win32':
      return bins.win

    case 'darwin':
      return bins.mac

    case 'linux':
      return bins.linux
  }
}

const cmdOpts = {
  maxBuffer: 1024 * 1000,
}

export default async function parseReplay(
  file: string
): Promise<Replay | undefined> {
  return new Promise((resolve, reject) => {
    const bin = getBin()

    if (bin != null) {
      const exe = fileURLToPath(
        new URL(`../src/bin/${RRRocketVersion}/${bin}`, import.meta.url)
      )
      const cmd = `${exe} -j "${
        process.platform === 'win32'
          ? file.split(path.sep).join(path.posix.sep)
          : file
      }"`

      console.log('Executing', chalk.blue(cmd))

      exec(cmd, cmdOpts, (error, stdout, stderr) => {
        if (error || stderr) {
          const message = error ? error.message : stderr ? stderr : null

          reject(message)
        }

        const data = JSON.parse(stdout.toString())
        const replay = Replay.fromReplay(file, data)

        resolve(replay)
      })
    }
  })
}
