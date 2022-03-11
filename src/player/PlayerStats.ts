import * as RRRocket from '~/lib/RRRocket'
import { Base } from '~/models'
import Replay from '~/replays/Replay'
import Player from './Player'

export const PlayerStatsSchema = {
  name: 'PlayerStats',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    player: 'objectId',
    replay: 'objectId',
    assists: 'int?',
    demos: 'int?',
    goals: 'int?',
    saves: 'int?',
    score: 'int?',
    shots: 'int?',
    team: 'int?',
  },
}

export type PlayerStatsEntity = PlayerStats & {
  player: Player
  replay: Replay
}

export default class PlayerStats extends Base<PlayerStats> {
  assists?: number
  demos?: number
  goals?: number
  saves?: number
  score?: number
  shots?: number
  team?: 0 | 1

  static toEntity(replay: Replay): PlayerStatsEntity[] {
    return replay?.players?.map((p) => {
      return {
        player: p,
        replay,
        ...p.stats,
      }
    })
  }

  static fromStats(stats: RRRocket.PlayerStats) {
    return new PlayerStats({
      assists: stats.Assists,
      goals: stats.Goals,
      saves: stats.Saves,
      score: stats.Score,
      shots: stats.Shots,
      team: stats.Team,
    })
  }
}
