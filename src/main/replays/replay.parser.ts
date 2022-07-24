import path from 'node:path'
import { Platform, Playlist } from '@shared/enums'
import { PlayerDTO, ReplayDTO, StatsDTO } from '@shared/types'
import { isValidDate } from '@shared/utils/date'
import * as RRRocket from '~/lib/RRRocket'
import MapIdMap from '~/maps/MapIdMap'
import PlatformMap from '~/maps/PlatformMap'
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
      .toUpperCase() as keyof typeof PlatformMap

    return PlatformMap[name]
  }
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

export const parseReplay = async (
  filePath: string,
  data: RRRocket.Replay
): Promise<ReplayDTO> => {
  const fileName = path.basename(filePath)
  const playlist = data.properties.MatchType.toUpperCase() as Uppercase<
    keyof typeof Playlist
  >
  const mapName = data.properties.MapName.toUpperCase() as Uppercase<
    keyof typeof MapIdMap
  >
  const map = MapIdMap[mapName] ? MapIdMap[mapName].join('.') : null

  if (map == null) {
    logger.warn('replay.parser', `Found unknown map "${mapName}"`)

    await saveUnknownValue('map', mapName)
  }

  if (playlist == null) {
    logger.warn('replay.parser', `Found unknown playlist "${playlist}"`)

    await saveUnknownValue('playlist', playlist)
  }

  return {
    path: filePath,
    name: fileName,
    matchDate: parseDate(data.properties.Date) ?? null,
    hash: data.header_crc.toString(),
    map,
    playlist: Playlist[playlist] ?? null,
    matchLength: Math.round(
      data.properties.NumFrames / data.properties.RecordFPS
    ),
    ranked: null,
    season: null,
    stats: await parsePlayerStats(data),
  }
}
