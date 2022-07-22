import EventEmitter from 'events'
import { Paged, Progress, Replay } from '@shared/types'
import { connect } from '~/db/client'
import * as RRRocket from '~/lib/RRRocket'
import RRRocketParser from '~/lib/RRRocketParser'
import { savePlayerStats } from '~/players/player.service'
import logger from '~/utils/logger'
import { parseReplay } from './replay.parser'

const parser = new RRRocketParser()
const client = connect()
const emitter = new EventEmitter()

export const deleteReplay = async (filePath: string) => {
  await client.$transaction([
    client.stats.deleteMany({
      where: {
        replay: {
          path: filePath,
        },
      },
    }),
    client.replay.delete({
      where: {
        path: filePath,
      },
    }),
  ])
}

export const getReplays = async (
  page = 0,
  take = 30
): Promise<Paged<Replay>> => {
  const skip = Math.ceil(page * take)
  const [count, data] = await client.$transaction([
    client.replay.count({
      take,
      skip,
    }),
    client.replay.findMany({
      take,
      skip,
      include: {
        stats: {
          include: {
            player: true,
          },
        },
      },
    }),
  ])

  return {
    data,
    count,
    page,
    take,
  }
}

/**
 * Filters out replays already saved in the database.
 * @param files Replay file paths.
 * @returns Replay files that haven't already been imported.
 */
const filterReplays = async (...files: string[]) => {
  const replays = (
    await client.replay.findMany({
      select: {
        path: true,
      },
    })
  ).map((replay) => replay.path)

  return files.filter((f) => !replays.includes(f))
}

const importReplay = async (
  filePath: string,
  data: RRRocket.Replay
): Promise<Replay | undefined> => {
  const { stats, ...parsedReplay } = parseReplay(filePath, data)

  if (parsedReplay == null) {
    return
  }

  const savedReplay = await client.replay.create({
    data: {
      ...parsedReplay,
      createdAt: new Date(),
    },
  })

  const savedStats = await savePlayerStats(savedReplay.id, stats)

  return {
    ...savedReplay,
    stats: savedStats,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on = (event: string, handler: (...args: any[]) => void) => {
  emitter.removeAllListeners(event).on(event, handler)
}

export const importReplays = async (...files: string[]) => {
  const filesTotal = files.length

  logger.info('replay.import', `Processing ${filesTotal} files for import...`)

  const filtered = await filterReplays(...files)
  const toImportTotal = filtered.length

  if (toImportTotal < 1) {
    logger.info('replay.import', 'No new replays to import.')

    return
  }

  emitter.emit('import:start', filesTotal)

  logger.info('replay.import', `Found ${toImportTotal} replay(s) to import...`)

  let progress = filesTotal - toImportTotal

  for await (const parsedBatch of parser.parseReplays(...filtered)) {
    for await (const { file, data } of parsedBatch) {
      const event: Progress = {
        progress,
        total: filesTotal,
        message: `Importing "${file}"`,
        status: 'success',
      }

      try {
        const replay = await importReplay(file, data)

        emitter.emit('replay:imported', replay)

        logger.debug(
          'replay.import',
          `(${progress}/${toImportTotal}) Imported "${file}"`
        )
      } catch (err) {
        logger.error('replay.import', `Unable to import "${file}"`, err)
        event.message = `Error importing "${file}"`
      } finally {
        progress += 1
        event.progress = progress

        emitter.emit('import:progress', progress, filesTotal, event)
      }
    }
  }

  emitter.emit('import:complete')
}
