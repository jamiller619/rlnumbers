import { HTMLAttributes, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Player, Replay, Stats } from '@shared/types'
import intl from '~/store/intl'
import useStore, { State } from '~/store/useStore'

export type Team = {
  color: 'orange' | 'blue'
  score: number
  players: Player[]
}

export type RecentMatchProps = HTMLAttributes<HTMLElement> & {
  length?: number
}

type MatchProps = HTMLAttributes<HTMLElement> & {
  replay: Replay
}

const Container = styled.div`
  display: block;
`

const parseReplayFileName = (name: string) => {
  return name.replace('.replay', '')
}

const getTeamScore = (team: Stats[]) => {
  return team.reduce((score, p) => score + (p.goals ?? 0), 0)
}

const getTeamPlayers = (game: Replay, team: number) =>
  game.stats.filter((p) => p.team === team)

const parseTeam = (game: Replay, team: number): Team => {
  const stats = getTeamPlayers(game, team)

  return {
    color: team === 1 ? 'orange' : 'blue',
    score: getTeamScore(stats),
    players: stats.map((s) => s.player),
  }
}

const parseMatch = (replay: Replay) => {
  const playlist =
    replay.playlist == null ? null : intl('playlist', replay.playlist)

  return {
    id: replay.id,
    hash: replay.hash,
    name: parseReplayFileName(replay.name),
    date: replay.matchDate,
    playlist,
    length: replay.matchLength,
    map: replay.map,
    team: {
      blue: parseTeam(replay, 0),
      orange: parseTeam(replay, 1),
    },
  }
}

const MatchContainer = styled('div')`
  display: flex;
  align-items: center;
`

const Scores = styled('div')`
  display: flex;
  flex-direction: row;
`

const TeamScore = styled('div')`
  padding: 1rem;
  font-weight: bold;
`

const BlueTeam = styled(TeamScore)`
  background: #00bfff;
  color: #0046c5;
`

const OrangeTeam = styled(TeamScore)`
  background: #ffd992;
  color: #ff7600;
`

const MatchContent = styled('div')`
  width: 100%;
`

const Match: React.FC<MatchProps> = ({ replay, ...props }) => {
  const match = parseMatch(replay)

  return (
    <MatchContainer {...props}>
      <MatchContent>
        {match.name}
        <br />
        {match.playlist}
      </MatchContent>
      <Scores>
        <BlueTeam>{match.team.blue.score}</BlueTeam>
        <OrangeTeam>{match.team.orange.score}</OrangeTeam>
      </Scores>
    </MatchContainer>
  )
}

const sorter = (a: Replay, b: Replay) => {
  if (a.matchDate != null && b.matchDate != null) {
    const at = a.matchDate.getTime()
    const bt = b.matchDate.getTime()

    if (at < bt) {
      return 1
    } else if (at > bt) {
      return -1
    }
  }

  return 0
}

const selector = ({ replays, fetchReplays }: State) => {
  return {
    replays: Object.values(replays).sort(sorter),
    fetchReplays,
  }
}

const getReplaysIdValue = (replays: Replay[]) => {
  return replays.reduce((acc, replay) => acc + replay.id, 0)
}

const comparer = (
  a: ReturnType<typeof selector>,
  b: ReturnType<typeof selector>
) => {
  return getReplaysIdValue(a.replays) === getReplaysIdValue(b.replays)
}

let renderCount = 0

export default function RecentGames({
  length = 5,
  ...props
}: RecentMatchProps): JSX.Element {
  const { replays, fetchReplays } = useStore(selector, comparer)
  const replayLen = replays.length
  const [page, setPage] = useState(0)

  console.log('rendered', (renderCount += 1))

  useEffect(() => {
    if (replayLen === 0) {
      fetchReplays(page, length, { prop: 'matchDate', order: 'desc' })
    }
  }, [fetchReplays, length, page, replayLen])

  return (
    <Container {...props}>
      {replays.map((replay) => (
        <Match key={replay.hash} replay={replay} />
      ))}
    </Container>
  )
}
