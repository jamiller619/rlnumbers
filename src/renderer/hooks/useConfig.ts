import useSWR from 'swr'
import { ConfigKey } from '@shared/types'

const fetcher = (key: ConfigKey) => {
  return window.api?.config.get(key)
}

export default function useConfig<T>(key: ConfigKey) {
  const {
    data,
    isValidating: isLoading,
    error,
    mutate,
  } = useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    data,
    isLoading,
    error,
    mutate: async (value: T) => {
      await window.api?.config.set(key, value)

      return mutate(value)
    },
  } as {
    data: T | null
    isLoading: boolean
    error: unknown
    mutate(value: T): Promise<void>
  }
}
