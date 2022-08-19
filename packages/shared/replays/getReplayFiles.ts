import klaw from 'klaw'
import logger from '../logger'

const ext = '.replay'

const isReplay = (file: string) => file.endsWith(ext)

export default async function* getReplayFiles(dir?: string | null) {
  if (dir != null) {
    try {
      for await (const file of klaw(dir)) {
        if (isReplay(file.path)) {
          yield file.path
        }
      }
    } catch (err) {
      logger.error(
        'replay.getReplayFiles',
        `Unable to get replay files in "${dir}"`,
        err
      )
    }
  }
}
