import { StrictMode, useCallback, useEffect, useState } from 'react'
import { render } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Config, Replay } from '@shared/types'
import { Console, Header } from '~/components'
import StyleProvider from './style/StyleProvider'

const root = document.getElementById('root') as HTMLElement

const App = () => {
  const [config, setConfig] = useState<Config | null>(null)
  const [dir] = config?.dirs ?? []
  const [replays, setReplays] = useState<Replay[]>([])

  useEffect(() => {
    window.api?.config.get().then(setConfig)
    window.api?.replays.get().then(setReplays)
  }, [])

  const handleSetDir = useCallback(async () => {
    const dir = await window.api?.dialog.openDirectory()

    const updatedConfig = await window.api?.config.set('dirs', [dir])

    if (updatedConfig) {
      setConfig(updatedConfig)
    }
  }, [])

  const handleImport = useCallback(async () => {
    await window.api?.replays.import(dir)
  }, [dir])

  return (
    <div>
      <Header />
      {config?.theme}
      <br />
      {config?.dirs?.map((dir, i) => (
        <div key={i}>{dir}</div>
      ))}
      <button onClick={handleSetDir}>Set replay dir</button>
      <br />
      <br />
      {replays?.map((replay) => {
        return <div key={replay.hash}>{replay.name}</div>
      })}
      {dir != null && <button onClick={handleImport}>Import</button>}
      <Console />
    </div>
  )
}

// createRoot(root).render(
//   <StrictMode>
//     <StyleProvider>
//       <App />
//     </StyleProvider>
//   </StrictMode>
// )
render(
  <StrictMode>
    <StyleProvider>
      <App />
    </StyleProvider>
  </StrictMode>,
  root
)
