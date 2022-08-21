import { PlayerDTO, StatsDTO } from '@rln/shared/types'
import BaseService from '~/services/BaseService'

export default class PlayerService extends BaseService {
  findByOnlineId(onlineId: string) {
    return this.client.player.findFirst({
      where: {
        onlineId,
      },
    })
  }

  upsert(data: PlayerDTO) {
    return data.onlineId == null
      ? this.client.player.create({
          data: {
            ...data,
            createdAt: new Date(),
          },
        })
      : this.client.player.upsert({
          where: {
            onlineId: data.onlineId,
          },
          create: {
            ...data,
            createdAt: new Date(),
          },
          update: {
            ...data,
          },
        })
  }

  async save(player: PlayerDTO) {
    if (player.onlineId != null) {
      const existing = await this.findByOnlineId(player.onlineId)

      if (existing && existing.name !== player.name) {
        return this.upsert({
          ...existing,
          aka: [...(existing.aka?.split(',') ?? ''), player.name].join(','),
        })
      }
    }

    return this.upsert(player)
  }

  saveStats(replayId: number, stats: StatsDTO[]) {
    return Promise.all(
      stats.map(async ({ player, ...playerStats }) => {
        const savedPlayer = await this.save(player)
        const savedStats = await this.client.stats.create({
          data: {
            ...playerStats,
            replayId,
            playerId: savedPlayer.id,
          },
        })

        return {
          ...savedStats,
          player: savedPlayer,
        }
      })
    )
  }
}
