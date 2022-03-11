import * as RRRocket from '~/lib/RRRocket'
import { Base, Map } from '~/models'
import Player from '~/player/Player'
import { isValidDate } from '~/utils/date'

export const ReplaySchema = {
  name: 'Replay',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    map: 'int?',
    createDate: 'date',
    path: 'string',
    hash: 'string',
    matchDate: 'date?',
    matchType: 'string?',
    matchLength: 'int?',
  },
}

export default class Replay extends Base<Replay> {
  map?: number
  createDate = new Date()
  path!: string
  hash!: string
  matchDate?: Date
  matchType?: string
  matchLength?: number
  players!: Player[]

  static fromReplay(path: string, data: RRRocket.Replay) {
    const players = Player.fromReplay(data)

    const result = new Replay({
      matchDate: parseDate(data.properties.Date),
      path,
      hash: data.header_crc.toString(),
      map: Map.fromMapName(data.properties.MapName).id,
      matchType: data.properties.MatchType,
      matchLength: data.properties.NumFrames / data.properties.RecordFPS,
      players,
    })

    return result
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
