import { Playlist, Rank } from '../enums'

const MMRRange = {
  [Playlist.DUEL]: {
    [Rank.BRONZE]: {
      [1]: 0,
      [2]: 156,
      [3]: 215,
    },
    [Rank.SILVER]: {
      [1]: 275,
      [2]: 335,
      [3]: 395,
    },
    [Rank.GOLD]: {
      [1]: 455,
      [2]: 515,
      [3]: 575,
    },
    [Rank.PLATINUM]: {
      [1]: 635,
      [2]: 695,
      [3]: 755,
    },
    [Rank.DIAMOND]: {
      [1]: 815,
      [2]: 875,
      [3]: 935,
    },
    [Rank.CHAMPION]: {
      [1]: 995,
      [2]: 1055,
      [3]: 1107,
    },
    [Rank.GRAND_CHAMPION]: {
      [1]: 1175,
      [2]: 1226,
      [3]: 1290,
    },
    [Rank.SSL]: 1346,
  },
  [Playlist.DOUBLES]: {
    [Rank.BRONZE]: {
      [1]: 0,
      [2]: 189,
      [3]: 237,
    },
    [Rank.SILVER]: {
      [1]: 295,
      [2]: 354,
      [3]: 407,
    },
    [Rank.GOLD]: {
      [1]: 475,
      [2]: 535,
      [3]: 595,
    },
    [Rank.PLATINUM]: {
      [1]: 655,
      [2]: 715,
      [3]: 775,
    },
    [Rank.DIAMOND]: {
      [1]: 835,
      [2]: 915,
      [3]: 995,
    },
    [Rank.CHAMPION]: {
      [1]: 1075,
      [2]: 1195,
      [3]: 1315,
    },
    [Rank.GRAND_CHAMPION]: {
      [1]: 1435,
      [2]: 1566,
      [3]: 1710,
    },
    [Rank.SSL]: 1889,
  },
  [Playlist.STANDARD]: {
    [Rank.BRONZE]: {
      [1]: 0,
      [2]: 176,
      [3]: 235,
    },
    [Rank.SILVER]: {
      [1]: 295,
      [2]: 355,
      [3]: 415,
    },
    [Rank.GOLD]: {
      [1]: 475,
      [2]: 535,
      [3]: 595,
    },
    [Rank.PLATINUM]: {
      [1]: 655,
      [2]: 715,
      [3]: 775,
    },
    [Rank.DIAMOND]: {
      [1]: 835,
      [2]: 915,
      [3]: 995,
    },
    [Rank.CHAMPION]: {
      [1]: 1075,
      [2]: 1195,
      [3]: 1315,
    },
    [Rank.GRAND_CHAMPION]: {
      [1]: 1435,
      [2]: 1575,
      [3]: 1715,
    },
    [Rank.SSL]: 1876,
  },
} as const

export default MMRRange
