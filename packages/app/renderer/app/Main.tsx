import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Menu, WindowControls } from '~/components'
import { Box } from '~/elements'

const Container = styled(Box)`
  display: flex;
`

const MainLayout = styled.div`
  display: flex;
  height: 100vh;
  flex: 2;
`

const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface.bgSubtle};
  width: 100%;
  margin-right: ${({ theme }) => theme.space.small};
  margin-bottom: ${({ theme }) => theme.titlebar.height}px;
  border-radius: ${({ theme }) => theme.radii.large}px;
  border-top-left-radius: ${({ theme }) => theme.radii.large ?? 0 * 2}px;
`

export default function Main(): JSX.Element {
  return (
    <Fragment>
      <WindowControls />
      <Container>
        <Menu />
        <MainLayout>
          <MainContent>
            <Outlet />
          </MainContent>
        </MainLayout>
      </Container>
    </Fragment>
  )
}
