import path from 'node:path'
import { Platform, Playlist } from '@shared/enums'
import { CamSettingsDTO, PlayerDTO, ReplayDTO, StatsDTO } from '@shared/types'
import { isValidDate } from '@shared/utils/date'
import { RRRocket } from '~/lib/rrrocket'
import mapIdMap from '~/maps/mapId.map'
import platformMap from '~/maps/platform.map'
import seasonsMap from '~/maps/seasons.map'
import { saveUnknownValue } from '~/unknown/unknown.service'
import logger from '~/utils/logger'

// Replay date format: "YYYY-MM-DD HH-MM-SS"
const parseDate = (dateString: string) => {
  const [date, t] = dateString.split(' ')
  const time = t.replace(/-/g, ':')
  const d = new Date(`${date} ${time}`)

  if (isValidDate(d)) {
    return d
  }
}

const parseSeason = (matchDate?: Date | null): number | undefined => {
  if (matchDate != null) {
    let season = 1

    for (const endDate of seasonsMap) {
      if (matchDate.getTime() < endDate.getTime()) {
        break
      }

      season += 1
    }

    return season
  }
}

const parseOnlineId = (onlineId?: string | null) => {
  if (!onlineId || (onlineId?.length ?? 0) < 5) {
    return undefined
  }

  return onlineId
}

const parsePlatform = (platform?: RRRocket.Platform): Platform | undefined => {
  if (platform?.kind === 'OnlinePlatform') {
    const name = platform.value
      .replace('OnlinePlatform_', '')
      .toUpperCase() as keyof typeof platformMap

    return platformMap[name]
  }
}

const findActors = (data: RRRocket.Replay) => {
  const actors: { name: string; actorId: number }[] = []

  if (data.network_frames == null) {
    throw new Error('No network frames found')
  }

  for (const networkFrame of data.network_frames.frames) {
    for (const updatedActor of networkFrame.updated_actors) {
      if (updatedActor.attribute?.String != null) {
        actors.push({
          name: updatedActor.attribute.String,
          actorId: updatedActor.actor_id,
        })
      }
    }
  }

  return actors
}

const parsePlayer = async (data: RRRocket.PlayerStats): Promise<PlayerDTO> => {
  const platform = parsePlatform(data.Platform)

  if (platform == null) {
    logger.warn(
      'replay.parser',
      `Found unknown platform "${data.Platform.value}"`
    )

    await saveUnknownValue('platform', data.Platform.value)
  }

  return {
    name: data.Name,
    aka: null,
    onlineId: parseOnlineId(data.OnlineID) ?? null,
    platform: platform ?? null,
  }
}

const parseStats = async (
  stats: RRRocket.PlayerStats,
  debugInfo: RRRocket.DebugInfo[]
): Promise<StatsDTO> => {
  const playerInfo = debugInfo.find((d) => {
    const { user } = d
    const pid = user.split('|')[1]

    return pid === stats.OnlineID
  })

  const mmrText = playerInfo?.text ?? null
  const mmr = mmrText?.split('|')?.[0]
  const player = await parsePlayer(stats)

  return {
    assists: stats.Assists,
    goals: stats.Goals,
    saves: stats.Saves,
    score: stats.Score,
    shots: stats.Shots,
    team: stats.Team,
    mmr: mmr ? Math.round(Number(mmr)) : null,
    demos: null,
    player,
  }
}

const parsePlayerStats = (data: RRRocket.Replay): Promise<StatsDTO[]> => {
  const stats = data.properties.PlayerStats ?? []

  return Promise.all(stats.map((s) => parseStats(s, data.debug_info)))
}

const findPlayerByActorId = (data: RRRocket.Replay, players: PlayerDTO[]) => {
  const actors = findActors(data)

  return (actorId: number) => {
    const playerName = actors.find((a) => a.actorId === actorId)?.name

    return players.find((p) => p.name === playerName)
  }
}

const parsePlayerCamSettings = (
  data: RRRocket.Replay,
  players: PlayerDTO[]
) => {
  if (data.network_frames == null) {
    return
  }

  const findPlayer = findPlayerByActorId(data, players)
  const actorCamSettings: Record<number, CamSettingsDTO> = {}

  for (const networkFrame of data.network_frames.frames) {
    for (const updatedActor of networkFrame.updated_actors) {
      if (updatedActor.attribute?.CamSettings != null) {
        if (updatedActor.actor_id != null) {
          actorCamSettings[updatedActor.actor_id] =
            updatedActor.attribute.CamSettings
        }
      }
    }
  }

  return Object.entries(actorCamSettings)
    .map(([actorId, camSettings]) => {
      const player = findPlayer(Number(actorId))

      if (player != null) {
        return {
          player,
          camSettings,
        }
      }
    })
    .filter((s) => s != null) as
    | { player: PlayerDTO; camSettings: CamSettingsDTO }[]
    | undefined
}

const parseOwner = (filename: string, players: PlayerDTO[]) => {
  let found: PlayerDTO | null = null

  for (const player of players) {
    if (filename.toLowerCase().includes(player.name.toLowerCase())) {
      found = player

      break
    }
  }

  return found
}

export const parseReplayWithNetworkData = async (
  filePath: string,
  data: RRRocket.Replay
) => {
  const replay = await parseReplay(filePath, data)
  const camSettings = parsePlayerCamSettings(
    data,
    replay.stats.map((s) => s.player)
  )

  return {
    ...replay,
    wasNetworkParsed: true,
    camSettings,
  }
}

export const parseReplay = async (
  filePath: string,
  data: RRRocket.Replay
): Promise<ReplayDTO> => {
  const fileName = path.basename(filePath)
  const matchDate = parseDate(data.properties.Date) ?? null
  const playlist = data.properties.MatchType.toUpperCase() as Uppercase<
    keyof typeof Playlist
  >
  const mapName = data.properties.MapName.toUpperCase() as Uppercase<
    keyof typeof mapIdMap
  >
  const map = mapIdMap[mapName] ? mapIdMap[mapName].join('.') : null

  if (map == null) {
    logger.warn('replay.parser', `Found unknown map "${mapName}"`)

    await saveUnknownValue('map', mapName)
  }

  if (playlist == null) {
    logger.warn('replay.parser', `Found unknown playlist "${playlist}"`)

    await saveUnknownValue('playlist', playlist)
  }

  const stats = await parsePlayerStats(data)
  const players = stats.map((s) => s.player)
  const owner = parseOwner(fileName, players)

  return {
    path: filePath,
    name: fileName,
    matchDate,
    hash: data.header_crc.toString(),
    map,
    playlist: Playlist[playlist] ?? null,
    matchLength: Math.round(
      data.properties.NumFrames / data.properties.RecordFPS
    ),
    ranked: null,
    season: parseSeason(matchDate) ?? null,
    wasNetworkParsed: false,
    stats,
    owner,
  }
}
