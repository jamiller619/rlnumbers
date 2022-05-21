import {
  Player as PlayerSchema,
  Replay as ReplaySchema,
  Stats,
} from '@prisma/client'
import Player from './Player'

type Replay = Omit<ReplaySchema, 'id'> & {
  players: Player[]
}

export default Replay

export type ReplayEntity = ReplaySchema & {
  playerStats: (Stats & {
    player: PlayerSchema
  })[]
}
