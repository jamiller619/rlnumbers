import create, { SetState } from 'zustand'
import { Progress, Theme } from '@rln/shared/types'

export type State = {
  import: Progress
  isWindowFocused: boolean
  theme: Theme | null

  setTheme: (themeName: string) => Promise<void>
}

type Set = SetState<State>

const handleImportStart = (set: Set) => (_: unknown, total: number) => {
  set({
    import: {
      progress: 0,
      total,
      message: null,
      status: null,
    },
  })
}

const handleImportProgress = (set: Set) => (_: unknown, data: Progress) => {
  set({
    import: {
      ...data,
    },
  })
}

const handleImportComplete = (set: Set) => () => {
  set({
    import: {
      progress: null,
      total: null,
      message: null,
      status: null,
    },
  })
}

const theme = (await window.api?.themes.get()) ?? null

const useStore = create((set: Set): State => {
  window.api?.on('import:start', handleImportStart(set))
  window.api?.on('import:progress', handleImportProgress(set))
  window.api?.on('import:complete', handleImportComplete(set))

  window.addEventListener('blur', () => {
    set({
      isWindowFocused: false,
    })
  })

  window.addEventListener('focus', () => {
    set({
      isWindowFocused: true,
    })
  })

  return {
    isWindowFocused: true,
    import: {
      progress: null,
      total: null,
      message: null,
      status: null,
    },
    theme,

    setTheme: async (name: string) => {
      await window.api?.config.set('theme.name', name)

      const theme = await window.api?.themes.get()

      if (theme != null) {
        set({
          theme,
        })
      }
    },
  }
})

export default useStore
