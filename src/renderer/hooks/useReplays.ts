import useSWR from 'swr'
import { ReplayEntity, Sort } from '@shared/types'

type UseReplayParams = {
  page?: number
  take?: number
  sort?: Sort<ReplayEntity>
}

const fetcher = ({ page, take, sort }: UseReplayParams) => {
  return window.api?.replays.get(page, take, sort)
}

export default function useReplays({ page, take, sort }: UseReplayParams) {
  const {
    data: replays,
    isValidating: isLoading,
    error,
  } = useSWR({ page, take, sort }, fetcher)

  return { replays, isLoading, error }
}
