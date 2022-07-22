import { Pane, TagInput } from 'evergreen-ui'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Api } from '@shared/api'
import Page from '../components/Page'

const Section = styled(Pane).attrs({
  display: 'flex',
  alignItems: 'start',
})`
  margin-bottom: 1rem;

  > * {
    padding: 1rem 1rem 1rem 0;
  }
`

const Label = styled.label`
  font-weight: bold;
  text-align: right;
  width: 200px;
`

export default function Settings(): JSX.Element {
  const { data, ...query } = useQuery('config', async () => {
    const api = window.api ?? ({} as Api)

    const [config, claimed, players] = await Promise.all([
      api.config.get?.(),
      api.players.getClaimed?.(),
      api.players.getAll?.(),
    ])

    const unclaimed = players.filter((p) => !claimed.some((c) => c.id === p.id))

    return {
      config,
      claimed,
      unclaimed,
      players,
    }
  })

  const handleNameClaim = useCallback(async (names: string[]) => {
    for await (const name of names) {
      window.api?.players.claim(name)
    }
  }, [])

  return (
    <Page title="Settings" {...query}>
      <Section>
        <Label>Replay directories:</Label>
        <TagInput values={data?.config?.dirs} />
      </Section>
      <Section>
        <Label>Claimed players:</Label>
        <TagInput
          values={data?.claimed.map((c) => c.name)}
          autocompleteItems={data?.unclaimed.map((d) => d.name)}
          onChange={handleNameClaim}
        />
      </Section>
      <Section>
        <Label>Theme:</Label>
        <div>{data && data.config?.theme}</div>
      </Section>
    </Page>
  )
}
