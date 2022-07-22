import path from 'node:path'
import { Platform, Playlist } from '@shared/enums'
import { Map, PlayerDTO, ReplayDTO, StatsDTO } from '@shared/types'
import { isValidDate } from '@shared/utils/date'
import * as RRRocket from '~/lib/RRRocket'
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

const PlatformMap = {
  dingo: Platform.XBOX,
  xbox: Platform.XBOX,
  ps3: Platform.PSN,
  ps4: Platform.PSN,
  steam: Platform.STEAM,
  unknown: Platform.UNKNOWN,
  epic: Platform.EPIC,
}

const parsePlatform = (platform?: RRRocket.Platform): Platform | undefined => {
  if (platform?.kind === 'OnlinePlatform') {
    const name = platform.value
      .replace('OnlinePlatform_', '')
      .toLowerCase() as keyof typeof PlatformMap

    return PlatformMap[name] ?? Platform.UNKNOWN
  } else {
    logger.warn('replay.parser', `Found unknown platform "${platform}"`)
  }
}

const parsePlayer = (data: RRRocket.PlayerStats): PlayerDTO => {
  return {
    name: data.Name,
    aka: null,
    onlineId: parseOnlineId(data.OnlineID) ?? null,
    platform: parsePlatform(data.Platform) ?? null,
  }
}

const parseStats = (
  stats: RRRocket.PlayerStats,
  debugInfo: RRRocket.DebugInfo[]
): StatsDTO => {
  const playerInfo = debugInfo.find((d) => {
    const { user } = d
    const pid = user.split('|')[1]

    return pid === stats.OnlineID
  })

  const mmrText = playerInfo?.text ?? null
  const mmr = mmrText?.split('|')?.[0]

  return {
    assists: stats.Assists,
    goals: stats.Goals,
    saves: stats.Saves,
    score: stats.Score,
    shots: stats.Shots,
    team: stats.Team,
    mmr: mmr ? Math.round(Number(mmr)) : null,
    demos: null,
    player: parsePlayer(stats),
  }
}

const parsePlayerStats = (data: RRRocket.Replay): StatsDTO[] => {
  const stats = data.properties.PlayerStats ?? []

  return stats.map((s) => parseStats(s, data.debug_info))
}

export const parseReplay = (
  filePath: string,
  data: RRRocket.Replay
): ReplayDTO => {
  const fileName = path.basename(filePath)
  const playlist = data.properties.MatchType.toUpperCase() as Uppercase<
    keyof typeof Playlist
  >
  const mapName = data.properties.MapName.toUpperCase() as Uppercase<
    keyof typeof Map
  >

  return {
    path: filePath,
    name: fileName,
    matchDate: parseDate(data.properties.Date) ?? null,
    hash: data.header_crc.toString(),
    map: Map[mapName] ?? null,
    playlist: Playlist[playlist] ?? null,
    matchLength: Math.round(
      data.properties.NumFrames / data.properties.RecordFPS
    ),
    ranked: null,
    season: null,
    stats: parsePlayerStats(data),
  }
}
