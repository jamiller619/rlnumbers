import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Heading } from '~/elements'
import { ReplayDirs } from '~/features/settings'
import useConfig from '~/hooks/useConfig'

const Container = styled(Box)`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 60vw;
`

export default function BlankSlate() {
  const { data, mutate, isLoading } = useConfig<string[]>('dirs')
  const [dirs, setDirs] = useState<string[]>(data ?? [])

  const handleChange = useCallback(
    (data: string[]) => {
      setDirs(data)
    },
    [setDirs]
  )

  const handleNext = useCallback(() => {
    mutate(dirs)
  }, [dirs, mutate])

  return (
    <Container>
      <Heading.Sub mb={4} mt={5}>
        Where are your replay files?
      </Heading.Sub>
      <Content p={5} bg="surfaceBg">
        {!isLoading && <ReplayDirs data={dirs} onChange={handleChange} />}
        <Button.Primary mt={5} onClick={handleNext}>
          Next
        </Button.Primary>
      </Content>
    </Container>
  )
}
