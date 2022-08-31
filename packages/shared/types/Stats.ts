import { Stats as StatsEntity } from '@prisma/client'
import { Player, PlayerDTO } from '~/types'

type Stats = Readonly<StatsEntity> & {
  readonly player: Player
}

export default Stats

export type StatsDTO = Readonly<
  Omit<Stats, 'id' | 'replayId' | 'playerId' | 'player'>
> & {
  player: PlayerDTO
}
