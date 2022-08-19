import type { ExecOptions } from 'node:child_process'
import jq from 'node-jq'
import exec from '~/utils/exec'
import { exe } from './loader'
import type * as RRRocket from './types'

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
