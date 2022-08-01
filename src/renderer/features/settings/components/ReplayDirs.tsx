import { useCallback, useEffect, useMemo, useState } from 'react'
import Datalist from '~/components/DataList'
import { Box, BoxProps, Button, FlexSpread, Label } from '~/components/elements'
import useConfig from '~/hooks/useConfig'

export default function ReplayDirs(props: BoxProps) {
  const { data, mutate, isLoading } = useConfig<string[]>('dirs')
  const dirs = useMemo(() => data ?? [], [data])
  const datalistData = useMemo(
    () => dirs.map((d) => ({ text: d, value: d })),
    [dirs]
  )
  const [defaultDir, setDefaultDir] = useState<string | null>(null)

  useEffect(() => {
    if (defaultDir == null) {
      window.api?.replays.getDefaultDirectory().then(setDefaultDir)
    }
  }, [defaultDir])

  const includesDefaultDir = useMemo(
    () => dirs.includes(defaultDir ?? ''),
    [defaultDir, dirs]
  )

  const addDir = useCallback(
    async (dir: string) => {
      if (!dirs.includes(dir)) {
        mutate([dir, ...dirs])
      }
    },
    [dirs, mutate]
  )

  const removeDir = useCallback(
    async (dir: string) => {
      mutate(dirs.filter((d) => d !== dir))
    },
    [dirs, mutate]
  )

  const handleChooseDir = useCallback(async () => {
    const chosen = (await window.api?.dialog.openDirectory()) ?? []

    for await (const dir of chosen) {
      await addDir(dir)
    }
  }, [addDir])

  const handleAddDefaultDir = useCallback(async () => {
    if (defaultDir != null) {
      await addDir(defaultDir)
    }
  }, [defaultDir, addDir])

  return (
    <Box {...props}>
      {isLoading && <Label>Loading...</Label>}
      <Label mb={3}>Replay directories:</Label>
      <Datalist
        mt={2}
        data={datalistData}
        onDelete={({ text }) => removeDir(text)}
      />
      <FlexSpread mt={4}>
        <Button onClick={handleChooseDir}>Add replay directory</Button>
        {!includesDefaultDir && (
          <Button onClick={handleAddDefaultDir}>Add default directory</Button>
        )}
      </FlexSpread>
    </Box>
  )
}
