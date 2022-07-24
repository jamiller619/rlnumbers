import { CompetitivePlaylist, Playlist, Rank } from '../enums'

type RanksWithDivisions = Exclude<Rank, Rank.SSL>

type MMRMap = {
  [key in CompetitivePlaylist]: {
    [key in RanksWithDivisions]: number[]
  }
}

const MMRRankMap: MMRMap = {
  [Playlist.DUEL]: {
    [Rank.BRONZE]: [155, 214, 274],
    [Rank.SILVER]: [334, 394, 454],
    [Rank.GOLD]: [514, 574, 634],
    [Rank.PLATINUM]: [694, 754, 814],
    [Rank.DIAMOND]: [874, 934, 994],
    [Rank.CHAMPION]: [1054, 1106, 1174],
    [Rank.GRAND_CHAMPION]: [1225, 1289, 1345],
  },
  [Playlist.DOUBLES]: {
    [Rank.BRONZE]: [188, 236, 294],
    [Rank.SILVER]: [353, 406, 474],
    [Rank.GOLD]: [534, 594, 654],
    [Rank.PLATINUM]: [714, 774, 834],
    [Rank.DIAMOND]: [914, 994, 1074],
    [Rank.CHAMPION]: [1194, 1314, 1434],
    [Rank.GRAND_CHAMPION]: [1565, 1709, 1888],
  },
  [Playlist.STANDARD]: {
    [Rank.BRONZE]: [175, 234, 294],
    [Rank.SILVER]: [354, 414, 474],
    [Rank.GOLD]: [534, 594, 654],
    [Rank.PLATINUM]: [714, 774, 834],
    [Rank.DIAMOND]: [914, 994, 1074],
    [Rank.CHAMPION]: [1194, 1314, 1434],
    [Rank.GRAND_CHAMPION]: [1574, 1714, 1874],
  },
}

export default (
  playlist: CompetitivePlaylist,
  mmr: number
): { rank: Rank; division?: number } => {
  const playlistMap = MMRRankMap[playlist]

  for (let i = Rank.BRONZE; i < Rank.SSL; i++) {
    const rank = playlistMap[i as RanksWithDivisions]

    if (mmr <= rank[2]) {
      for (let j = 0; j < 2; j++) {
        if (mmr <= rank[j]) {
          return {
            rank: i,
            division: j + 1,
          }
        }
      }
    }
  }

  return {
    rank: Rank.SSL,
  }
}
