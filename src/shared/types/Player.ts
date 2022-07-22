import { Player as PlayerEntity } from '@prisma/client'

type Player = Readonly<PlayerEntity>

export default Player

export type PlayerDTO = Omit<Player, 'id' | 'createdAt'>
