import { Page } from '~/components'
import ReplayDirs from './components/ReplayDirs'

export default function Settings(): JSX.Element {
  return (
    <Page title="Settings">
      <ReplayDirs width="50vw" />
    </Page>
  )
}
