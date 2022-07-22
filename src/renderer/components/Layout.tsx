import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Header, Menu } from '~/components'

const Grid = styled.div`
  display: grid;
  grid-template-areas: 'menu content';
  grid-template-columns: 80px 1fr;
  grid-column-gap: 0;
  grid-row-gap: 5px;
  height: 100vh;
  width: 100vw;
`

const ContentArea = styled.div`
  grid-area: content;
  background-color: ${({ theme }) => theme.colors.surface200};
`

const MenuArea = styled(Menu)`
  grid-area: menu;
`

export default function Layout(): JSX.Element {
  return (
    <Fragment>
      <Header />
      <Grid>
        <MenuArea />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </Grid>
    </Fragment>
  )
}
