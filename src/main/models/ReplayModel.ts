import path from 'node:path'
import { MapName } from '@shared/enums/Map'
import { Map, MapNamesMap, Replay, ReplayEntity } from '@shared/types'
import { isValidDate } from '~/../shared/utils/date'
import * as RRRocket from '~/lib/RRRocket'

export default class ReplayModel {
  static fromEntity(data: ReplayEntity): Replay {
    return {
      createDate: data.createDate,
      matchDate: data.matchDate,
      hash: data.hash,
      map: data.map,
      matchType: data.matchType,
      matchLength: data.matchLength,
      name: data.name,
      path: data.path,
      players: data.playerStats.map((stats) => {
        return {
          ...stats.player,
          stats,
        }
      }),
    }
  }

  static fromReplay(
    filePath: string,
    data: RRRocket.Replay
  ): Omit<Replay, 'players'> {
    const fileName = path.basename(filePath)

    const mapName = data.properties.MapName.toLowerCase()

    return {
      path: filePath,
      name: fileName,
      createDate: new Date(),
      matchDate: parseDate(data.properties.Date) ?? null,
      hash: data.header_crc.toString(),
      map: fromMapName(mapName as keyof typeof MapNamesMap).id,
      matchType: data.properties.MatchType,
      matchLength: Math.round(
        data.properties.NumFrames / data.properties.RecordFPS
      ),
    }
  }
}

// Replay date format: "YYYY-MM-DD HH-MM-SS"
const parseDate = (dateString: string) => {
  const [date, t] = dateString.split(' ')
  const time = t.replace(/-/g, ':')
  const d = new Date(`${date} ${time}`)

  if (isValidDate(d)) {
    return d
  }
}

const fromMapName = (mapName: keyof typeof MapNamesMap): Map => {
  const [name, ...attrs] = MapNamesMap[mapName]

  if (name == null) {
    return {
      id: MapName.UNKNOWN,
    }
  }

  if (attrs.length > 0) {
    return {
      id: name,
      attributes: attrs,
    }
  }

  return {
    id: name,
  }
}
