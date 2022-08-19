import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Control } from '~/components'
import Datalist, { DataListItem } from '~/components/DataList'
import { Box, BoxProps, Button } from '~/elements'

type ReplayDirsProps = Omit<BoxProps, 'data' | 'onChange'> & {
  data?: string[] | null
  onChange?: (data: string[]) => void
}

const ButtonGroup = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
`

export default function ReplayDirs({ data, onChange }: ReplayDirsProps) {
  const dirs = useMemo(() => data ?? [], [data])
  const datalistData = useMemo<DataListItem[]>(() => {
    if (dirs.length > 0) {
      return dirs.map((d) => ({ text: d, value: d }))
    }

    return [
      { text: 'No replay directories selected', value: '', deletable: false },
    ]
  }, [dirs])
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
    (dir: string) => {
      if (!dirs.includes(dir)) {
        onChange?.([dir, ...dirs])
      }
    },
    [dirs, onChange]
  )

  const removeDir = useCallback(
    async (dir: string) => {
      onChange?.(dirs.filter((d) => d !== dir))
    },
    [dirs, onChange]
  )

  const handleChooseDir = useCallback(async () => {
    const chosen = (await window.api?.dialog.openDirectory()) ?? []

    for (const dir of chosen) {
      addDir(dir)
    }
  }, [addDir])

  const handleAddDefaultDir = useCallback(() => {
    if (defaultDir != null) {
      addDir(defaultDir)
    }
  }, [defaultDir, addDir])

  return (
    <Control label="Replay directories:">
      <Datalist
        mt={2}
        data={datalistData}
        onDelete={({ text }) => removeDir(text)}
      />
      <ButtonGroup mt={4}>
        <Button onClick={handleChooseDir}>Add replay directory</Button>
        {!includesDefaultDir && (
          <Button onClick={handleAddDefaultDir}>Add default directory</Button>
        )}
      </ButtonGroup>
    </Control>
  )
}
