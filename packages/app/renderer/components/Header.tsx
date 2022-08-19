import styled from 'styled-components'

const Container = styled.div`
  -webkit-app-region: drag;
  width: 100vw;
  height: 48px;
  position: fixed;
`

export default function Header(): JSX.Element {
  return <Container></Container>
}
