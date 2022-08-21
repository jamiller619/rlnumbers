import { RRRocket } from '@rln/shared/lib/rrrocket'
import logger from '@rln/shared/logger'
import {
  Paged,
  Player,
  PlayerDTO,
  Progress,
  Replay,
  ReplayEntity,
  Sort,
} from '@rln/shared/types'
import { PlayerService } from '~/services'
import BaseService from '~/services/BaseService'
import ReplayParser from './ReplayParser'
import directoryMap from './maps/directory'

export type ReplayServiceEvent = {
  ['replay:deleted']: (id: number) => void
  ['import:start']: (totalFiles: number) => void
  ['replay:imported']: (replay: Replay) => void
  ['import:progress']: (progress: Progress) => void
  ['import:complete']: () => void
}

export default class ReplayService extends BaseService<ReplayServiceEvent> {
  #playerService: PlayerService = new PlayerService()

  /**
   * Deletes a replay from the database, which cascades to
   * player stats. No players are deleted.
   * @param filePath Path to the replay file.
   */
  async delete(filePath: string) {
    try {
      const [_, deletedReplay] = await this.client.$transaction([
        this.client.stats.deleteMany({
          where: {
            replay: {
              path: filePath,
            },
          },
        }),
        this.client.replay.delete({
          where: {
            path: filePath,
          },
        }),
      ])

      this.emit('replay:deleted', deletedReplay.id)
      logger.info('replay.delete', `Deleted replay "${filePath}"`)
    } catch (err) {
      logger.error('replay.delete', 'Unable to delete replay', err)
    }
  }

  async get(
    page = 0,
    take = 30,
    sort: Sort<ReplayEntity> = {
      prop: 'createdAt',
      order: 'desc',
    }
  ): Promise<Paged<Replay>> {
    const skip = Math.ceil(page * take)
    const [count, data] = await this.client.$transaction([
      this.client.replay.count(),
      this.client.replay.findMany({
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
   * Gets a user's default replay directory based on their
   * OS and platform.
   * @returns The default path set by the game for replays.
   */
  async getDefaultDirectory() {
    const { platform, homedir } = await import('node:os')
    const { normalize } = await import('node:path')

    const dir = directoryMap[platform()]

    return normalize(dir.replace('%HOME%', homedir()))
  }

  async #handleOwner(
    replay: ReplayEntity,
    players: Player[],
    owner?: PlayerDTO | null
  ) {
    if (owner == null) {
      return replay
    }

    const ownerId = players.find(
      (p) => p.name === owner.name && p.onlineId === owner.onlineId
    )?.id

    if (ownerId == null) {
      return replay
    }

    return this.client.replay.update({
      where: {
        id: replay.id,
      },
      data: {
        ownerId,
      },
    })
  }

  async #import(filePath: string, data: RRRocket.Replay): Promise<Replay> {
    const { stats, owner, ...replay } = ReplayParser.parse(filePath, data)

    const savedReplay = await this.client.replay.upsert({
      where: {
        hash: replay.hash,
      },
      create: {
        ...replay,
        createdAt: new Date(),
      },
      update: {
        ...replay,
      },
    })

    const savedStats = await this.#playerService.saveStats(
      savedReplay.id,
      stats
    )

    const players = savedStats.map((s) => s.player)

    return {
      ...(await this.#handleOwner(savedReplay, players, owner)),
      stats: savedStats,
    }
  }

  /**
   * Filters out replays already saved in the database.
   * @param files Replay file paths.
   * @returns Replay files that haven't already been imported.
   */
  async #filterReplays(...files: string[]) {
    const replays = (
      await this.client.replay.findMany({
        select: {
          path: true,
        },
      })
    ).map((replay) => replay.path)

    return files.filter((f) => !replays.includes(f))
  }

  async importReplays(...files: string[]) {
    const { rrrocketParser: parser } = await import('@rln/shared/lib/rrrocket')
    const filesTotal = files.length

    if (filesTotal > 1) {
      logger.info('replay.import', `Processing ${filesTotal} replays...`)
    }

    const filtered = await this.#filterReplays(...files)
    const toImportTotal = filtered.length

    if (toImportTotal < 1) {
      logger.info('replay.import', 'No new replays to import.')

      return
    }

    this.emit('import:start', filesTotal)

    logger.info(
      'replay.import',
      `Found ${toImportTotal} replay(s) to import...`
    )

    let progress = filesTotal - toImportTotal + 1

    for await (const parsedBatch of parser(false, ...filtered)) {
      for await (const { file, data } of parsedBatch) {
        const progressEvent: Progress = {
          progress,
          total: filesTotal,
          message: `Importing "${file}"`,
          status: 'success',
        }

        try {
          const replay = await this.#import(file, data)

          this.emit('replay:imported', replay)

          logger.debug(
            'replay.import',
            `(${progress}/${toImportTotal}) Imported "${file}"`
          )
        } catch (err) {
          logger.error('replay.import', `Unable to import "${file}"`, err)
          progressEvent.message = `Error importing "${file}"`
        } finally {
          progress += 1
          progressEvent.progress = progress

          this.emit('import:progress', progressEvent)
        }
      }
    }

    this.emit('import:complete')
  }
}
