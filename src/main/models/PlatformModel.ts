import Platform from '@shared/enums/Platform'
import * as RRRocket from '~/lib/RRRocket'

const PlatformMap = {
  dingo: Platform.XBOX,
  xbox: Platform.XBOX,
  ps3: Platform.PSN,
  ps4: Platform.PSN,
  steam: Platform.STEAM,
  unknown: Platform.UNKNOWN,
  epic: Platform.EPIC,
} as const

type PlatformMapKey = keyof typeof PlatformMap

export default class PlatformModel {
  static fromReplay(platform?: RRRocket.Platform): Platform | undefined {
    if (platform?.kind === 'OnlinePlatform') {
      const name = platform.value
        .replace('OnlinePlatform_', '')
        .toLowerCase() as PlatformMapKey

      return PlatformMap[name] ?? Platform.UNKNOWN
    } else {
      console.log('Found unknown platform', platform)
    }
  }
}
