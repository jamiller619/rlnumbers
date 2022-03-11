import chalk from 'chalk'
import EventEmitter from 'node:events'
import parseReplay from '~/lib/RRRocketParser'
import Replay from './Replay'
import ReplayRepository from './ReplayRepository'

export default class ReplayImporter extends EventEmitter {
  files: string[]
  repo = new ReplayRepository()

  constructor(replayFiles: string[]) {
    super()

    this.files = replayFiles

    console.log(chalk.blue(`Found ${this.files.length} replays to import`))

    this.import()
      .catch((err) => {
        this.emit('error', err)
      })
      .finally(() => {
        this.emit('complete')
      })
  }

  async import() {
    const replays = (
      await Promise.all(this.files.map((file) => parseReplay(file)))
    ).filter((r) => r != null) as Replay[] | undefined

    if (replays == null) {
      this.emit('error', new Error('CRITICAL: No replays found'))

      process.exit(1)
    }

    await this.repo.saveReplays(replays, this.handleProgress.bind(this))
  }

  private handleProgress(pct: number) {
    this.emit('progress', pct)
  }
}
