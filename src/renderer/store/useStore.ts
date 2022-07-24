import create, { SetState } from 'zustand'
import { Progress, Replay, ReplayEntity, Sort } from '@shared/types'

export type State = {
  import: Progress
  replays: Record<number, Replay>

  fetchReplays: (
    page?: number,
    take?: number,
    sort?: Sort<ReplayEntity>
  ) => Promise<void>
}

const handleImportStart =
  (set: SetState<State>) => (_: unknown, total: number) => {
    set({
      import: {
        progress: 0,
        total,
        message: null,
        status: null,
      },
    })
  }

const handleImportProgress =
  (set: SetState<State>) =>
  (_: unknown, { progress, message, status, total }: Progress) => {
    set({
      import: {
        progress,
        total,
        message,
        status,
      },
    })
  }

const handleReplayDelete =
  (set: SetState<State>) => (_: unknown, id: number) => {
    set((prev) => {
      const { replays } = prev

      delete replays[id]

      return { replays }
    })
  }

const handleReplayImport =
  (set: SetState<State>) => (_: unknown, replay: Replay) => {
    console.log('replay imported')
    set((prev) => ({
      replays: {
        ...prev.replays,
        [replay.id]: replay,
      },
    }))
  }

const handleReplayComplete = (set: SetState<State>) => () => {
  set({
    import: {
      progress: null,
      total: null,
      message: null,
      status: null,
    },
  })
}

const useStore = create((set: SetState<State>) => {
  window.api?.on('import:start', handleImportStart(set))
  window.api?.on('import:progress', handleImportProgress(set))

  window.api?.on('replay:deleted', handleReplayDelete(set))
  window.api?.on('replay:imported', handleReplayImport(set))
  window.api?.on('import:complete', handleReplayComplete(set))

  return {
    import: {
      progress: null,
      total: null,
      message: null,
      status: null,
    },
    replays: {},
    fetchReplays: async (
      page?: number,
      take?: number,
      sort?: Sort<ReplayEntity>
    ) => {
      const paged = await window.api?.replays.get(page, take, sort)

      if (paged && Array.isArray(paged.data) && paged.data.length > 0) {
        set((prev) => ({
          replays: {
            ...prev.replays,
            ...paged.data.reduce((acc, replay) => {
              acc[replay.id] = replay
              return acc
            }, {} as Record<number, Replay>),
          },
        }))
      }
    },
  }
})

window.getState = () => useStore.getState()

export default useStore
