import EventEmitter from 'node:events'
import { Player, Replay } from '@shared/types'
import wait from '@shared/utils/wait'
import { connect } from '~/db/client'
import ProgressEmitter from '~/lib/ProgressEmitter'
import * as RRRocket from '~/lib/RRRocket'
import RRRocketParser from '~/lib/RRRocketParser'
import PlayerModel from '~/models/PlayerModel'
import ReplayModel from '~/models/ReplayModel'
import list from '~/utils/list'
import ConfigService from './ConfigService'

const parser = new RRRocketParser()

class Repository extends EventEmitter {
  client = connect()
}

type Parsed = {
  model: Omit<Replay, 'players'>
  parsed: RRRocket.Replay
}

let scanInterval: NodeJS.Timer | null = null

export default class ReplayService extends Repository {
  config = new ConfigService()

  constructor() {
    super()

    this.config.once('ready', () => {
      // This should be replaced with a listener that fires
      // when the Electron window opens. Not having that,
      // however, waiting 3 seconds works for now.
      wait(3).then(async () => {
        await this.#initScanInterval()
      })
    })
  }

  async getReplays(page = 0, take = 30): Promise<Replay[]> {
    const results = await this.client.replay.findMany({
      take,
      skip: Math.ceil(page * take),
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    })

    return results.map((result) => ReplayModel.fromEntity(result))
  }

  async import(dir: string) {
    const replays = await this.#findNewReplays(dir)
    const progressEmitter = new ProgressEmitter(replays.length)

    const results = []

    for await (const replay of replays) {
      try {
        const saved = await this.importReplay(replay.model, replay.parsed)

        results.push(saved)

        console.log(`Imported "${saved.name}"`)
      } catch (err) {
        console.error(`Error importing "${replay.model.name}"`)
      } finally {
        progressEmitter.emitProgress()
      }
    }
  }

  async #initScanInterval() {
    if (scanInterval) {
      clearInterval(scanInterval)
    }

    scanInterval = setInterval(async () => {
      await this.#scan()
    }, 1000 * 60 * this.config.get()['scan.interval'])

    await this.#scan()
  }

  async #scan() {
    // const { config } = this
    const config = this.config.get()

    if (config['scan.enabled'] && config.dirs != null) {
      for await (const dir of config.dirs) {
        await this.import(dir)
      }
    }
  }

  async #findNewReplays(dir: string) {
    console.log(`Scanning "${dir}" for new replays...`)
    const parsed = await this.#parseInitialReplays(dir)
    const filtered = await this.#filterReplays(parsed)

    if (filtered.length > 0) {
      console.log(`Found ${filtered.length} new replays.`)
    } else {
      console.log(`No new replays found.\n`)
    }

    return filtered
  }

  async #parseInitialReplays(dir: string) {
    const files = await getReplayFiles(dir)

    return Promise.all(
      files.map(async (file) => {
        const replay = await parser.parseReplay(file)

        return {
          model: ReplayModel.fromReplay(file, replay),
          parsed: replay,
        }
      })
    )
  }

  async importReplay(
    data: Omit<Replay, 'players'>,
    parsed: RRRocket.Replay
  ): Promise<Replay> {
    const players = PlayerModel.fromReplay(parsed)
    const savedReplay = await this.client.replay.create({
      data,
    })

    const savedPlayers = await this.#savePlayers(savedReplay.id, players)

    return {
      ...data,
      ...savedReplay,
      players: savedPlayers,
    }
  }

  async #filterReplays(replays: Parsed[]): Promise<Parsed[]> {
    const existingReplays = await this.client.replay.findMany({
      select: {
        hash: true,
        name: true,
      },
    })

    return replays.filter((replay) => {
      return !existingReplays.some(
        ({ hash, name }) =>
          hash === replay.model.hash || name === replay.model.name
      )
    })
  }

  async #savePlayers(replayId: number, players: Player[]) {
    const results: Player[] = []

    for await (const player of players) {
      const savedPlayer = await this.#savePlayer(player)
      const savedStats = await this.client.stats.create({
        data: {
          playerId: savedPlayer.id,
          replayId,
          ...player.stats,
        },
      })

      results.push({
        ...player,
        ...savedPlayer,
        stats: savedStats,
      })
    }

    return results
  }

  async #savePlayer(player: Player) {
    const data = {
      platform: player.platform,
      name: player.name,
      aka: player.aka,
      onlineId: player.onlineId,
    }

    if (player.onlineId != null) {
      return this.client.player.upsert({
        where: {
          onlineId: player.onlineId,
        },
        update: data,
        create: data,
      })
    } else {
      return this.client.player.create({
        data,
      })
    }
  }
}

const getReplayFiles = async (...dirs: string[]) => {
  return (
    await Promise.all(dirs.map((dir) => list(`${dir}/**/*.replay`)))
  ).flat()
}
