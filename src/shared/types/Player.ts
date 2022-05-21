import { Player as PlayerSchema, Stats } from '@prisma/client'

export type PlayerStats = Omit<Stats, 'id' | 'playerId' | 'replayId'>

type Player = Omit<PlayerSchema, 'id'> & {
  stats: PlayerStats
}

export default Player
