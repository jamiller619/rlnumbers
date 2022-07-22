import { Playlist as PlaylistType } from '../enums'

const Playlist = {
  [PlaylistType.DUEL]: 'Duel',
  [PlaylistType.DOUBLES]: 'Doubles',
  [PlaylistType.STANDARD]: 'Standard',
  [PlaylistType.CHAOS]: 'Chaos',
  [PlaylistType.HOOPS]: 'Hoops',
  [PlaylistType.SNOWDAY]: 'Snowday',
  [PlaylistType.RUMBLE]: 'Rumble',
  [PlaylistType.DROPSHOT]: 'Dropshot',
  [PlaylistType.PRIVATE]: 'Private',
  [PlaylistType.OFFLINE]: 'Offline',
  [PlaylistType.TOURNAMENT]: 'Tournament',
  [PlaylistType.ROCKETLABS]: 'Rocket Labs',
  [PlaylistType.HEATSEEKER]: 'Heatseeker',
  [PlaylistType.SEASON]: 'Season',
  [PlaylistType.SOLO_STANDARD]: 'Solo Standard',
  [PlaylistType.DROPSHOT_RUMBLE]: 'Dropshot Rumble',
} as const

export default Playlist
