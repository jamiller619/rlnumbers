import { HTMLAttributes, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Playlist, Replay, Stats } from '@shared/types'
import useStore, { State } from '~/store/useStore'

export type RecentGamesProps = HTMLAttributes<HTMLElement> & {
  length?: number
}

export type GameProps = HTMLAttributes<HTMLElement> & {
  game: Replay
}

const Container = styled.div`
  display: block;
`

const parseName = (name: string) => {
  return name.replace('.replay', '')
}

const getTeamScore = (team: Stats[]) => {
  return team.reduce((score, p) => score + (p.goals ?? 0), 0)
}

const getTeam = (game: Replay, team: number) =>
  game.stats.filter((p) => p.team === team)

const parseTeam = (game: Replay, team: number) => {
  const stats = getTeam(game, team)

  return {
    score: getTeamScore(stats),
    players: stats.map((s) => s.player),
  }
}

const parseGame = (game: Replay) => {
  return {
    id: game.id,
    hash: game.hash,
    name: parseName(game.name),
    date: game.matchDate,
    playlist: game.playlist
      ? Playlist[game.playlist as keyof typeof Playlist]
      : null,
    length: game.matchLength,
    map: game.map,
    blue: parseTeam(game, 0),
    red: parseTeam(game, 1),
  }
}

const GameContainer = styled('div')`
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

const GameContent = styled('div')`
  width: 100%;
`

const Game: React.FC<GameProps> = ({ game, ...props }) => {
  const parsedGame = parseGame(game)

  return (
    <GameContainer {...props}>
      <GameContent>
        {parsedGame.name}
        <br />
        {parsedGame.playlist}
      </GameContent>
      <Scores>
        <BlueTeam>{parsedGame.blue.score}</BlueTeam>
        <OrangeTeam>{parsedGame.red.score}</OrangeTeam>
      </Scores>
    </GameContainer>
  )
}

const selector = ({ replays, fetchReplays }: State) => {
  return {
    replays,
    fetchReplays,
  }
}

export default function RecentGames({
  length = 5,
  ...props
}: RecentGamesProps): JSX.Element {
  const { replays, fetchReplays } = useStore(selector)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (Object.keys(replays).length === 0) {
      fetchReplays(page, length)
    }
  }, [fetchReplays, length, page, replays])

  return (
    <Container {...props}>
      {Object.values(replays).map((replay) => (
        <Game key={replay.hash} game={replay} />
      ))}
    </Container>
  )
}
