import fs from 'node:fs/promises'
import Repository from '~/db/Repository'
import Player from '~/player/Player'
import PlayerRepository, { SavePlayerResults } from '~/player/PlayerRepository'
import PlayerStatsRepository from '~/player/PlayerStatsRepository'
import Replay from './Replay'

const percentage = (partial: number, total: number) => partial / total

export default class ReplayRepository extends Repository('Replay')<Replay> {
  playerRepo: PlayerRepository
  playerStatsRepo: PlayerStatsRepository

  constructor() {
    super()

    this.playerRepo = new PlayerRepository()
    this.playerStatsRepo = new PlayerStatsRepository()
  }
  /**
   * One does not simply save a single replay.
   * To prevent duplicate players, we need a group of
   * replays, then we can save all the players associated to
   * those replays, one at a time, ensuring no duplicates.
   * Once players are saved, we save the replays, then we
   * save PlayerStats (which includes a key to the Player
   * and key to the Replay).
   * @param replays Collection of replays
   */
  async saveReplays(
    replays: Replay[],
    onProgressCallback?: (
      pct: number,
      results?: SavePlayerResults | Replay
    ) => unknown
  ) {
    const total = replays.length
    let i = 0

    for await (const replay of replays) {
      await fs.writeFile(`${replay.id}.json`, JSON.stringify(replay, null, 2))

      await this.db.create(replay)

      for await (const player of replay.players) {
        const exists = await this.playerRepo.find(player.onlineId, player.name)

        if (exists == null) {
          await this.playerRepo.db.create(player)
        }

        await this.playerStatsRepo.db.create({
          ...player.stats,
          player: exists ?? player,
          replay,
        })
      }

      onProgressCallback?.(percentage(i, total))

      i += 1
    }
    // const uniquePlayers = this.filterUniquePlayers(replays)
    // const total = replays.length + uniquePlayers.length
    // const playersResult = await this.playerRepo.savePlayers(uniquePlayers)

    // onProgressCallback?.(percentage(uniquePlayers.length, total), playersResult)

    // let i = uniquePlayers.length
    // for await (const replay of replays) {
    //   const result = await this.db.create(replay)

    //   result.players = replay.players

    //   await this.playerStatsRepo.savePlayerStatsFromReplay(result)

    //   onProgressCallback?.(percentage(i, total), result)

    //   i += 1
    // }

    // onProgressCallback?.(1)
  }

  private filterUniquePlayers(replays: Replay[]): Player[] {
    return (
      (
        replays
          // Filter out replays that don't have players
          .filter((r) => (r.players?.length ?? 0) > 0)
          // Grab players
          .map((r) => r.players)
          // Flatten the array of arrays
          .flat() as Player[]
      )
        // Filter out null or undefined
        .filter((p) => p != null)
        // Remove duplicates by creating an array "results", only
        // adding an object to it if it doesn't already
        // exist. Then return that array.
        .reduce((results, player) => {
          if (!results.some((p) => Player.isEqual(p, player))) {
            return [...results, player]
          }

          return results
        }, [] as Player[])
    )
  }
}
