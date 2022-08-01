import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Menu, WindowControls } from '~/components'
import { BlankSlate } from '~/features'
import useConfig from '~/hooks/useConfig'

const MainLayout = styled.div`
  display: grid;
  grid-template-areas: 'menu content';
  grid-template-columns: 80px 1fr;
  grid-column-gap: 0;
  grid-row-gap: 5px;
  height: 100vh;
  width: 100vw;
`

const MainContent = styled.div`
  grid-area: content;
`

const MainMenu = styled(Menu)`
  grid-area: menu;
`

export default function Main(): JSX.Element {
  const { data, isLoading } = useConfig<string[] | null>('dirs')

  return (
    <Fragment>
      <WindowControls />
      {!isLoading &&
        (data == null || data.length === 0 ? (
          <BlankSlate />
        ) : (
          <MainLayout>
            <MainMenu />
            <MainContent>
              <Outlet />
            </MainContent>
          </MainLayout>
        ))}
    </Fragment>
  )
}
