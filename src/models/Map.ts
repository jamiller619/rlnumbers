export enum MapName {
  UNKNOWN = 0,
  AQUADOME,
  BECKWITH_PARK,
  CHAMPIONS_FIELD,
  CORE_707,
  COSMIC,
  DFH_STADIUM,
  DOUBLE_GOAL,
  DUNK_HOUSE,
  FARMSTEAD,
  FORBIDDEN_TEMPLE,
  MANNFIELD,
  NEO_TOKYO,
  OCTAGON,
  PILLARS,
  SALTY_SHORES,
  STARBASE_ARC,
  THROWBACK_STADIUM,
  UNDERPASS,
  URBAN_CENTRAL,
  UTOPIA_COLISEUM,
  UTOPIA_RETRO,
  WASTELAND,
  RIVALS_ARENA,
}

export enum MapAttribute {
  DAWN = 0,
  DAY,
  DUSK,
  HAUNTED,
  MIDNIGHT,
  NIGHT,
  SNOWY,
  STANDARD,
  STORMY,
  THE_UPSIDE_DOWN,
  VOLLEY,
}

export default class Map {
  id: MapName
  attributes?: MapAttribute[]

  static fromMapName(mapName: string): Map {
    const [name, ...attrs] = namesMap[mapName.toLowerCase()]

    if (name == null) {
      return new Map(MapName.UNKNOWN)
    }

    if (attrs.length > 0) {
      return new Map(name, attrs)
    }

    return new Map(name)
  }

  constructor(id: MapName, attributes?: MapAttribute[]) {
    this.id = id
    this.attributes = attributes
  }
}

type NamesMap = {
  [key: string]: [MapName, ...MapAttribute[]]
}

const namesMap: NamesMap = {
  // Starbase ARC,
  arc_p: [MapName.STARBASE_ARC],
  // Starbase ARC (Standard),
  arc_standard_p: [MapName.STARBASE_ARC, MapAttribute.STANDARD],
  // Salty Shores (Night),
  beach_night_p: [MapName.SALTY_SHORES, MapAttribute.NIGHT],
  // Salty Shores,
  beach_p: [MapName.SALTY_SHORES],
  // Salty Shores (Volley),
  beachvolley: [MapName.SALTY_SHORES, MapAttribute.VOLLEY],
  // Forbidden Temple,
  chn_stadium_p: [MapName.FORBIDDEN_TEMPLE],
  // Champions Field (Day),
  cs_day_p: [MapName.CHAMPIONS_FIELD, MapAttribute.DAY],
  // Rivals Arena,
  cs_hw_p: [MapName.RIVALS_ARENA],
  // Champions Field,
  cs_p: [MapName.CHAMPIONS_FIELD],
  // Mannfield (Night),
  eurostadium_night_p: [MapName.MANNFIELD, MapAttribute.NIGHT],
  // Mannfield,
  eurostadium_p: [MapName.MANNFIELD],
  // Mannfield (Stormy),
  eurostadium_rainy_p: [MapName.MANNFIELD, MapAttribute.STORMY],
  // Mannfield (Snowy),
  eurostadium_snownight_p: [MapName.MANNFIELD, MapAttribute.SNOWY],
  // Farmstead (Night),
  farm_night_p: [MapName.FARMSTEAD, MapAttribute.NIGHT],
  // Farmstead,
  farm_p: [MapName.FARMSTEAD],
  // Farmstead (The Upside Down)
  farm_upsidedown_p: [MapName.FARMSTEAD, MapAttribute.THE_UPSIDE_DOWN],
  // Urban Central (Haunted),
  haunted_trainstation_p: [MapName.URBAN_CENTRAL, MapAttribute.HAUNTED],
  // Dunk House,
  hoopsstadium_p: [MapName.DUNK_HOUSE],
  // Pillars,
  labs_circlepillars_p: [MapName.PILLARS],
  // Cosmic,
  labs_cosmic_p: [MapName.COSMIC],
  // Cosmic,
  labs_cosmic_v4_p: [MapName.COSMIC],
  // Double Goal,
  labs_doublegoal_p: [MapName.DOUBLE_GOAL],
  // Double Goal,
  labs_doublegoal_v2_p: [MapName.DOUBLE_GOAL],
  // Octagon,
  labs_octagon_02_p: [MapName.OCTAGON],
  // Octagon,
  labs_octagon_p: [MapName.OCTAGON],
  // Underpass,
  labs_underpass_p: [MapName.UNDERPASS],
  // Underpass,
  labs_underpass_v0_p: [MapName.UNDERPASS],
  // Utopia Retro,
  labs_utopia_p: [MapName.UTOPIA_RETRO],
  // Neo Tokyo,
  neotokyo_p: [MapName.NEO_TOKYO],
  // Neo Tokyo (Standard),
  neotokyo_standard_p: [MapName.NEO_TOKYO, MapAttribute.STANDARD],
  // Beckwith Park (Midnight),
  park_night_p: [MapName.BECKWITH_PARK, MapAttribute.MIDNIGHT],
  // Beckwith Park,
  park_p: [MapName.BECKWITH_PARK],
  // Beckwith Park (Stormy),
  park_rainy_p: [MapName.BECKWITH_PARK, MapAttribute.STORMY],
  // Core 707,
  shattershot_p: [MapName.CORE_707],
  // DFH Stadium (Day),
  stadium_day_p: [MapName.DFH_STADIUM, MapAttribute.DAY],
  // DFH Stadium (Stormy),
  stadium_foggy_p: [MapName.DFH_STADIUM, MapAttribute.STORMY],
  // DFH Stadium,
  stadium_p: [MapName.DFH_STADIUM],
  // DFH Stadium (Snowy),
  stadium_winter_p: [MapName.DFH_STADIUM, MapAttribute.SNOWY],
  // Throwback Stadium,
  throwbackstadium_p: [MapName.THROWBACK_STADIUM],
  // Urban Central (Dawn),
  trainstation_dawn_p: [MapName.URBAN_CENTRAL, MapAttribute.DAWN],
  // Urban Central (Night),
  trainstation_night_p: [MapName.URBAN_CENTRAL, MapAttribute.NIGHT],
  // Urban Central,
  trainstation_p: [MapName.URBAN_CENTRAL],
  // Aquadome,
  underwater_p: [MapName.AQUADOME],
  // Utopia Coliseum (Dusk),
  utopiastadium_dusk_p: [MapName.UTOPIA_COLISEUM, MapAttribute.DUSK],
  // Utopia Coliseum,
  utopiastadium_p: [MapName.UTOPIA_COLISEUM],
  // Utopia Coliseum (Snowy),
  utopiastadium_snow_p: [MapName.UTOPIA_COLISEUM, MapAttribute.SNOWY],
  // Wasteland (Night),
  wasteland_night_p: [MapName.WASTELAND, MapAttribute.NIGHT],
  // Wasteland (Standard, Night)
  wasteland_night_s_p: [
    MapName.WASTELAND,
    MapAttribute.STANDARD,
    MapAttribute.NIGHT,
  ],
  // Wasteland,
  wasteland_p: [MapName.WASTELAND],
  // Wasteland (Standard),
  wasteland_s_p: [MapName.WASTELAND, MapAttribute.STANDARD],
}
