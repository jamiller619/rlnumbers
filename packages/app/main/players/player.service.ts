import connect from '@rln/shared/db/connect'
import type { PlayerDTO, Stats, StatsDTO } from '@rln/shared/types'

const client = connect()

const savePlayer = async (player: PlayerDTO) => {
  const createAndUpdate = {
    create: {
      ...player,
      createdAt: new Date(),
    },
    update: {
      ...player,
    },
  }

  if (player.onlineId != null) {
    const existing = await client.player.findFirst({
      where: {
        onlineId: player.onlineId,
      },
    })

    if (existing != null && existing.name !== player.name) {
      return client.player.update({
        where: {
          onlineId: player.onlineId,
        },
        data: {
          ...existing,
          aka: [...(existing.aka?.split(',') ?? ''), player.name].join(','),
        },
      })
    }

    return client.player.upsert({
      where: {
        onlineId: player.onlineId,
      },
      ...createAndUpdate,
    })
  } else {
    return client.player.create({
      data: {
        ...createAndUpdate.create,
      },
    })
  }
}

export const savePlayerStats = async (replayId: number, stats: StatsDTO[]) => {
  const results: Stats[] = []

  for await (const { player, ...playerStats } of stats) {
    const savedPlayer = await savePlayer(player)
    const savedStats = await client.stats.create({
      data: {
        ...playerStats,
        replayId,
        playerId: savedPlayer.id,
      },
    })

    results.push({
      ...savedStats,
      player: savedPlayer,
    })
  }

  return results
}
