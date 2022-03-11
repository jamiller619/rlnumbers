import Repository from '~/db/Repository'
import Replay from '~/replays/Replay'
import { PlayerStatsEntity } from './PlayerStats'

export default class PlayerStatsRepository extends Repository(
  'PlayerStats'
)<PlayerStatsEntity> {
  async savePlayerStatsFromReplay(replay: Replay) {
    // for await (const replay of replay) {
    // const playerStats = PlayerStats.toEntity(replay)
    // for await (const playerStat of playerStats) {
    //   try {
    //     await this.db.create(playerStat)
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }
    // }
  }
}
