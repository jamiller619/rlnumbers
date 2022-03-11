import { Replay } from '~/lib/RRRocket'
import { Base, PlatformType } from '~/models'
import Platform from '~/models/Platform'
import PlayerStats from './PlayerStats'

export const PlayerSchema = {
  name: 'Player',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    onlineId: 'string?',
    platform: 'int?',
    name: 'string',
    aka: 'string[]',
  },
}

export default class Player extends Base<Player> {
  onlineId!: string
  platform: PlatformType = PlatformType.UNKNOWN
  name!: string
  stats!: PlayerStats

  static isEqual(a: Player, b: Player) {
    return a.name === b.name && a.onlineId === b.onlineId
  }

  static fromReplay(replay: Replay) {
    const stats = replay.properties.PlayerStats ?? []

    return stats.map((stat) => {
      if (stat != null) {
        const player = new Player({
          name: stat.Name,
          platform: Platform.fromReplay(stat.Platform),
          stats: PlayerStats.fromStats(stat),
        })

        if ((stat.OnlineID?.length ?? 0) > 5) {
          player.onlineId = stat.OnlineID
        }

        return player
      }
    }) as Player[] | undefined
  }
}
