import styled from 'styled-components'

export default function Header(): JSX.Element {
  return <Container />
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  -webkit-app-region: drag;
  width: 100vw;
  height: 48px;
`
