import { ExecOptions, exec as execSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import jq from 'node-jq'
import logger from '~/utils/logger'
import type * as RRRocket from './types'

const exec = promisify(execSync)

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

const exe = path.resolve(__dirname, './bin', getBin())

const getVersion = async () => {
  const { stdout } = await exec(`${exe} --version`)

  logger.info(
    'rrrocket',
    `Using rrrocket v${stdout.replace('rrrocket', '').trim()}`
  )
}

getVersion()

const batch = function* <T>(items: T[], size: number) {
  for (let i = 0; i < items.length; i += size) {
    yield items.slice(i, i + size)
  }
}

const opts: ExecOptions = {
  maxBuffer: 1024 * 1000,
}

export async function* parseReplays(
  withNetworkData = false,
  ...files: string[]
) {
  const batches = batch(files, 20)

  for await (const batch of batches) {
    const cmdOpts = `-j -m ${withNetworkData ? '-n' : ''}`.trim()
    const cmd = `${exe} ${cmdOpts} "${batch.join('" "')}"`
    const { stdout, stderr } = await exec(cmd, opts)

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
