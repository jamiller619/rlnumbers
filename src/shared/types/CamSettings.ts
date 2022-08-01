import { CamSettings as CamSettingsEntity } from '@prisma/client'

type CamSettings = Readonly<CamSettingsEntity>

export type CamSettingsDTO = Omit<CamSettings, 'id' | 'playerId' | 'replayId'>

export default CamSettings
