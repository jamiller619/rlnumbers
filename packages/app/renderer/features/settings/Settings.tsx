import { useCallback } from 'react'
import styled from 'styled-components'
import { Page } from '~/components'
import useConfig from '~/hooks/useConfig'
import ReplayDirs from './components/ReplayDirs'
import Theme from './components/Theme'

const Content = styled.div`
  width: 50vw;
`

export default function Settings(): JSX.Element {
  const {
    data: dirs,
    mutate: mutateDirs,
    isLoading: isDirsLoading,
  } = useConfig<string[]>('dirs')
  const {
    data: colorMode,
    mutate: mutateColorMode,
    isLoading: isColorModeLoading,
  } = useConfig<string>('theme.colors.mode')

  const handleDirChange = useCallback(mutateDirs, [mutateDirs])

  return (
    <Page title="Settings">
      <Content>
        {!isDirsLoading && (
          <ReplayDirs data={dirs} onChange={handleDirChange} />
        )}
        {!isColorModeLoading && <Theme />}
      </Content>
    </Page>
  )
}
