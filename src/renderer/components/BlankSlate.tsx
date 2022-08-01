import styled from 'styled-components'
import { Box, Button, Copy, Heading } from '~/components/elements'
import { ReplayDirs } from '~/features/settings'

const Container = styled(Box)`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.5;
`

export default function BlankSlate() {
  // const { data } = useConfig<Config['dirs']>('dirs')
  // const dirs = [...(data ?? [])]

  return (
    <Container>
      <Heading.Sub mb={7}>Where are your replay files?</Heading.Sub>
      <Box p={5} bg="surfaceBg">
        <ReplayDirs />
        <Button.Primary mt={4}>Next</Button.Primary>
      </Box>
    </Container>
  )
}
