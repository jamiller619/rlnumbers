import { exec as execSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import jq from 'node-jq'
import * as RRRocket from './RRRocket'

const exec = promisify(execSync)
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

const batch = function* <T>(items: T[], size: number) {
  for (let i = 0; i < items.length; i += size) {
    yield items.slice(i, i + size)
  }
}

export default class RRRocketParser {
  exe: string
  opts = {
    maxBuffer: 1024 * 1000,
  }

  constructor() {
    const bin = getBin()

    this.exe = path.resolve(
      __dirname,
      '../src/main/bin/rrrocket',
      RRROCKET_VERSION,
      bin
    )
  }

  async *parseReplays(...files: string[]) {
    const batches = batch(files, 20)

    for await (const batch of batches) {
      const cmd = `${this.exe} -j -m "${batch.join('" "')}"`
      const { stdout, stderr } = await exec(cmd, this.opts)

      if (stderr) {
        throw stderr
      } else {
        const result = (await jq.run('.', stdout, {
          input: 'string',
          output: 'compact',
        })) as string

        yield result.split('\r\n').map((data) => {
          const parsed = JSON.parse(data) as {
            file: string
            replay: RRRocket.Replay
          }

          return {
            file: parsed.file,
            data: parsed.replay,
          }
        })
      }
    }
  }
}
