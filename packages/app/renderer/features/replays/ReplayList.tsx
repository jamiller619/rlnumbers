import { HTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { Player, Replay, ReplayEntity, Sort, Stats } from '@rln/shared/types'
import useIntl from '~/hooks/useIntl'
import useReplays from '~/hooks/useReplays'

export type Team = {
  color: 'orange' | 'blue'
  score: number
  players: Player[]
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
  return {
    id: replay.id,
    hash: replay.hash,
    name: parseReplayFileName(replay.name),
    date: replay.matchDate,
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
  const playlist = useIntl('playlist', replay.playlist)

  return (
    <MatchContainer {...props}>
      <MatchContent>
        {match.name}
        <br />
        {playlist}
      </MatchContent>
      <Scores>
        <BlueTeam>{match.team.blue.score}</BlueTeam>
        <OrangeTeam>{match.team.orange.score}</OrangeTeam>
      </Scores>
    </MatchContainer>
  )
}

type ReplayListProps = HTMLAttributes<HTMLElement> & {
  length?: number
  sort?: Sort<ReplayEntity>
}

export default function ReplayList({
  length = 5,
  sort = { prop: 'matchDate', order: 'desc' },
  ...props
}: ReplayListProps): JSX.Element {
  const [page, setPage] = useState(0)
  const { replays, isLoading, error } = useReplays({
    page,
    take: length,
    sort,
  })

  return (
    <Container {...props}>
      {error && <div>{error}</div>}
      {!isLoading &&
        !error &&
        replays &&
        Object.values(replays.data ?? {}).map((replay) => (
          <Match key={replay.hash} replay={replay} />
        ))}
    </Container>
  )
}
