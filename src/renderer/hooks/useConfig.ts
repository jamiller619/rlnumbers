import useSWR from 'swr'
import { Config, ConfigValue } from '@shared/types'

const fetcher = (key: keyof Config) => {
  return window.api?.config.get(key)
}

export default function useConfig<T extends ConfigValue>(key: keyof Config) {
  const {
    data,
    isValidating: isLoading,
    error,
    mutate,
  } = useSWR(key, fetcher, {
    // revalidateIfStale: false,
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false,
  })

  return {
    data,
    isLoading,
    error,
    mutate: async (value: ConfigValue) => {
      const result = await window.api?.config.set(key, value)

      if (result != null) {
        return mutate(result[key])
      }
    },
  } as {
    data: T | null
    isLoading: boolean
    error: unknown
    mutate: (value: ConfigValue) => void
  }
}
