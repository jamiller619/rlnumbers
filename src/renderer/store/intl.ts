import { Intl } from '@shared/types'

const intl = (await window.api?.intl.get()) as Intl

export default function getIntl(key: keyof Intl, index: number) {
  return intl[key][index - 1]
}
