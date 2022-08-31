import { Replay as ReplayEntity } from '@prisma/client'
import { PlayerDTO, Stats, StatsDTO } from '~/types'

type Replay = Readonly<ReplayEntity> & {
  readonly stats: Stats[]
}

export default Replay

export type ReplayDTO = Omit<
  Replay,
  'id' | 'createdAt' | 'stats' | 'ownerId'
> & {
  readonly stats: StatsDTO[]
  readonly owner: PlayerDTO | null
}
