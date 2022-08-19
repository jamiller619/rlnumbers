import { Intl } from '@rln/shared/types'

const intl = (await window.api?.intl.get()) as Intl

export default function useIntl(key: keyof Intl, index?: number | null) {
  if (index != null) {
    return intl[key][index - 1]
  }

  return ''
}
