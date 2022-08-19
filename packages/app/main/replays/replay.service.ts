import EventEmitter from 'node:events'
import { ReplayFileCount } from '@rln/shared/api'
import { connect } from '@rln/shared/db'
import {
  Paged,
  Player,
  PlayerDTO,
  Progress,
  Replay,
  ReplayEntity,
  Sort,
} from '@rln/shared/types'
import type { RRRocket } from '~/lib/rrrocket'
import logger from '~/logger'
import { savePlayerStats } from '~/players/player.service'
import directoryMap from '~/replays/directory.map'
import { parseReplay } from '~/replays/replay.parser'

const client = connect()
const emitter = new EventEmitter()

export const on = emitter.on.bind(emitter)
export const off = emitter.off.bind(emitter)
export const emit = emitter.emit.bind(emitter)

const ext = '.replay'
export const isReplay = (file: string) => file.endsWith(ext)

export async function* getReplayFiles(...dirs: string[]) {
  const { default: klaw } = await import('klaw')

  for (const dir of dirs) {
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

const COUNT_LIMIT = 150

export async function* countReplayFiles(
  ...dirs: string[]
): AsyncIterable<ReplayFileCount> {
  let count = 0
  const len = Math.min(dirs.length, COUNT_LIMIT)

  for await (const file of getReplayFiles(...dirs)) {
    if (count < len && count < COUNT_LIMIT) {
      count++

      yield {
        file,
        count,
      }
    } else {
      break
    }
  }

  return count
}

export const getDefaultDirectory = async () => {
  const { platform, homedir } = await import('node:os')
  const { normalize } = await import('node:path')

  const dir = directoryMap[platform()]

  return normalize(dir.replace('%HOME%', homedir()))
}

export const deleteReplay = async (filePath: string) => {
  try {
    const [_, deletedReplay] = await client.$transaction([
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

    emitter.emit('replay:deleted', deletedReplay.id)
    logger.info('replay.delete', `Deleted replay "${filePath}"`)
  } catch (err) {
    logger.error('replay.delete', 'Unable to delete replay', err)
  }
}

export const getReplays = async (
  page = 0,
  take = 30,
  sort: Sort<ReplayEntity> = {
    prop: 'createdAt',
    order: 'desc',
  }
): Promise<Paged<Replay>> => {
  const skip = Math.ceil(page * take)
  const [count, data] = await client.$transaction([
    client.replay.count(),
    client.replay.findMany({
      take,
      skip,
      orderBy: {
        [sort.prop]: sort.order,
      },
      include: {
        stats: {
          include: {
            player: true,
          },
        },
      },
    }),
  ])

  logger.debug(
    'query.replays',
    `Queried replays w/params: ${JSON.stringify({ page, take, sort })}`
  )

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

const handleOwner = async (
  replay: ReplayEntity,
  players: Player[],
  owner?: PlayerDTO | null
) => {
  if (owner == null) {
    return replay
  }

  const ownerId = players.find(
    (p) => p.name === owner.name && p.onlineId === owner.onlineId
  )?.id

  if (ownerId == null) {
    return replay
  }

  return client.replay.update({
    where: {
      id: replay.id,
    },
    data: {
      ownerId,
    },
  })
}

const importReplay = async (
  filePath: string,
  data: RRRocket.Replay
): Promise<Replay | undefined> => {
  const { stats, owner, ...parsedReplay } = await parseReplay(filePath, data)

  const savedReplay = await client.replay.upsert({
    where: {
      hash: parsedReplay.hash,
    },
    create: {
      ...parsedReplay,
      createdAt: new Date(),
    },
    update: {
      ...parsedReplay,
    },
  })

  const savedStats = await savePlayerStats(savedReplay.id, stats)
  const players = savedStats.map((s) => s.player)

  return {
    ...(await handleOwner(savedReplay, players, owner)),
    stats: savedStats,
  }
}

export const importReplays = async (...files: string[]) => {
  const { parseReplays } = await import('~/lib/rrrocket')
  const filesTotal = files.length

  if (filesTotal > 1) {
    logger.info('replay.import', `Processing ${filesTotal} replays...`)
  }

  const filtered = await filterReplays(...files)
  const toImportTotal = filtered.length

  if (toImportTotal < 1) {
    logger.info('replay.import', 'No new replays to import.')

    return
  }

  emitter.emit('import:start', filesTotal)

  logger.info('replay.import', `Found ${toImportTotal} replay(s) to import...`)

  let progress = filesTotal - toImportTotal + 1

  for await (const parsedBatch of parseReplays(false, ...filtered)) {
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
