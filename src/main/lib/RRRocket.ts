export type Platform = {
  kind: 'OnlinePlatform'
  value: string
}

export type DebugInfo = {
  frame: number
  user: string
  text: string
}

export type PlayerStats = {
  Assists: number
  bBot: boolean
  Goals: number
  Name: string
  OnlineID: string
  Platform: Platform
  Saves: number
  Score: number
  Shots: number
  Team: 0 | 1
}

export type Keyframe = {
  frame: number
  position: number
  time: number
}

export type TickMark = {
  description: string
  frame: number
}

export type Highlight = {
  BallName: string
  CarName: string
  frame: number
}

export type Goal = {
  frame: number
  PlayerName: string
  PlayerTeam: 0 | 1
}

export type Properties = {
  BuildID: number
  BuildVersion: string
  Changelist: number
  Date: string
  GameVersion: number
  Goals: Goal[]
  Highlights: Highlight[]
  Id: string
  KeyframeDelay: number
  MapName: string
  MatchType: string
  MaxChannels: number
  MaxReplaySizeMB: number
  NumFrames: number
  PlayerStats?: PlayerStats[]
  PrimaryPlayerTeam: number
  RecordFPS: number
  ReplayLastSaveVersion: number
  ReplayName: string
  ReplayVersion: number
  ReserveMegabytes: number
  Team0Score: number
  Team1Score: number
  TeamSize: number
  UnfairTeamSize: number
}

export type Replay = {
  content_crc: number
  content_size: number
  game_type: 'TAGame.Replay_Soccar_TA'
  header_crc: number
  header_size: number
  keyframes: Keyframe[]
  debug_info: DebugInfo[]
  levels: string[]
  major_version: number
  minor_version: number
  net_version: number
  properties: Properties
  tick_marks: TickMark[]
}
