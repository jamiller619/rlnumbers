import * as RRRocket from '~/lib/RRRocket'

export enum PlatformType {
  UNKNOWN = 0,
  STEAM,
  EPIC,
  XBOX,
  PSN,
  SWITCH,
}

const platformMap = {
  dingo: PlatformType.XBOX,
  xbox: PlatformType.XBOX,
  ps3: PlatformType.PSN,
  ps4: PlatformType.PSN,
  steam: PlatformType.STEAM,
  unknown: PlatformType.UNKNOWN,
  epic: PlatformType.EPIC,
}

export default class Platform {
  static fromReplay(platform?: RRRocket.Platform) {
    if (platform?.kind === 'OnlinePlatform') {
      const name = platform.value
        .replace('OnlinePlatform_', '')
        .toLowerCase() as keyof typeof platformMap

      return platformMap[name] ?? PlatformType.UNKNOWN
    } else {
      console.log('Found unknown platform', platform)
    }
  }
}
