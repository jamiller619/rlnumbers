import { Replay as ReplayEntity } from '@prisma/client'
import Stats, { StatsDTO } from './Stats'

type Replay = Readonly<ReplayEntity> & {
  readonly stats: Stats[]
}

export default Replay

export type ReplayDTO = Omit<Replay, 'id' | 'createdAt' | 'stats'> & {
  readonly stats: StatsDTO[]
}
