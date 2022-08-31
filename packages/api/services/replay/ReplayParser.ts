import path from 'node:path'
import logger from 'logger'
import { Platform, Playlist } from '@rln/shared/enums'
import { PlayerDTO, ReplayDTO, StatsDTO } from '@rln/shared/types'
import { isValidDate } from '@rln/shared/utils/date'
import { RRRocket } from '~/rrrocket'
import mapIdMap from './maps/mapId'
import platformMap from './maps/platform'
import seasonsMap from './maps/seasons'

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

const parsePlayer = (data: RRRocket.PlayerStats): PlayerDTO => {
  const platform = parsePlatform(data.Platform)

  if (platform == null) {
    logger.warn(
      'replay.unknown',
      `Found unknown platform "${data.Platform.value}"`
    )
  }

  return {
    name: data.Name,
    aka: null,
    onlineId: parseOnlineId(data.OnlineID) ?? null,
    platform: platform ?? null,
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
  const player = parsePlayer(stats)

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

const parsePlayerStats = (data: RRRocket.Replay): StatsDTO[] => {
  const stats = data.properties.PlayerStats ?? []

  return stats.map((s) => parseStats(s, data.debug_info))
}

export default class ReplayParser {
  // Replay file name format:
  // "{year}-{month}-{day}.{hour}.{minute} {ownerName} {playlist} {matchResult}"
  // "2022-08-20.00.15 la di fn da Ranked Standard Win 2022-08-20.00.15.replay"
  // Playlist won't always show up in filenames, and if it
  // doesn't, an empty space will be displayed in its absence.
  static parseFileName(fileName: string) {
    const year = Number(fileName.slice(0, 4))
    const month = Number(fileName.slice(5, 7))
    const day = Number(fileName.slice(8, 10))
    const hour = Number(fileName.slice(11, 13))
    const minute = Number(fileName.slice(14, 16))
    const win = fileName.lastIndexOf('Win')
    const loss = fileName.lastIndexOf('Loss')
    const ownerStartIndex = 17
    const matchResultStart = win > -1 ? win : loss
    const matchResultEnd = win > -1 ? 3 : 4
    const matchResult = fileName.slice(
      matchResultStart,
      matchResultStart + matchResultEnd
    )
    const includesPlaylist =
      fileName.slice(matchResultStart - 2, matchResultStart) !== '  '

    const d = new Date()

    d.setFullYear(year, month - 1, day)
    d.setHours(hour, minute, 0, 0)

    const resp = {
      date: d,
      win: matchResult === 'Win',
      playlist: undefined,
    }

    if (includesPlaylist) {
      const isCasual = fileName.lastIndexOf('Casual')
      const isPrivate = fileName.lastIndexOf('Private')
      const isRanked = fileName.lastIndexOf('Ranked')
      const ownerEndIndex =
        (isCasual > -1 ? isCasual : isPrivate > -1 ? isPrivate : isRanked) - 1

      const owner = fileName.slice(ownerStartIndex, ownerEndIndex)
      const secondDateStart =
        fileName.lastIndexOf(year.toString()) - 1 - matchResultEnd
      const playlist = fileName.slice(ownerEndIndex + 1, secondDateStart - 1)

      return {
        ...resp,
        owner,
        playlist,
      }
    }

    const owner = fileName.slice(ownerStartIndex, matchResultStart - 1)

    return {
      ...resp,
      owner,
    }
  }

  static parse(filePath: string, data: RRRocket.Replay): ReplayDTO {
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
      logger.warn('replay.unknown', `Found unknown map "${mapName}"`)
    }

    if (playlist == null) {
      logger.warn('replay.unknown', `Found unknown playlist "${playlist}"`)
    }

    const stats = parsePlayerStats(data)
    const { owner: ownerName } = this.parseFileName(fileName)
    const players = stats.map((s) => s.player)
    const owner = players.find((p) => p.name === ownerName) ?? null

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
}
