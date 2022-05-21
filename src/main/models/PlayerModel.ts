import { Stats } from '@prisma/client'
import { Player, PlayerStats } from '@shared/types'
import * as RRRocket from '~/lib/RRRocket'
import PlatformModel from './PlatformModel'

export class PlayerStatsModel {
  static fromReplay(stats: RRRocket.PlayerStats): PlayerStats {
    return {
      assists: stats.Assists,
      goals: stats.Goals,
      saves: stats.Saves,
      score: stats.Score,
      shots: stats.Shots,
      team: stats.Team,
      demos: 0,
    }
  }
}

export default class PlayerModel {
  static fromEntity(data: Stats): Player {
    return {
      name: data.name,
      aka: data.aka,
      onlineId: data.onlineId,
      platform: data.platform,
      stats: data.stats,
    }
  }

  static fromReplay(replay: RRRocket.Replay) {
    const stats = replay.properties.PlayerStats ?? []

    return stats.filter((stat) => stat != null).map(PlayerModel.fromStats)
  }

  static fromStats(stats: RRRocket.PlayerStats): Player {
    const player: Player = {
      name: stats.Name,
      aka: null,
      onlineId: parseOnlineId(stats.OnlineID) ?? null,
      platform: PlatformModel.fromReplay(stats.Platform) ?? null,
      stats: PlayerStatsModel.fromReplay(stats),
    }

    return player
  }
}

const parseOnlineId = (onlineId?: string | null) => {
  if (!onlineId || (onlineId?.length ?? 0) < 5) {
    return undefined
  }

  return onlineId
}
