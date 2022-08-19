import { Page } from '~/components'
import { RecentMatches } from '~/features'

export default function Overview(): JSX.Element {
  return (
    <Page title="Overview">
      <RecentMatches />
    </Page>
  )
}
