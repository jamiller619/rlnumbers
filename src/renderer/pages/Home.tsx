import RecentGames from '~/components/RecentGames'
import useStore, { State } from '~/store/useStore'
import Page from '../components/Page'

const selector = (state: State) => ({
  import: state.import,
})

export default function Home(): JSX.Element {
  const state = useStore(selector)

  return (
    <Page title="Overview">
      {state.import.progress && state.import.progress}
      <RecentGames />
    </Page>
  )
}
