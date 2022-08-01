import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.warningBase};
`

export default function Overlay() {
  return <Container />
}
