import fs from 'node:fs/promises'
import path from 'node:path'
import logger from 'logger'
import osLocale from 'os-locale'
import { Intl } from '@rln/shared/types'
import { distRoot } from '~/config'

let intl: Intl | null = null
const root = path.resolve(distRoot, 'locales')

const getLocaleJSON = async (locale: string): Promise<Intl> => {
  try {
    const p = path.resolve(root, `${locale}.json`)
    const data = await fs.readFile(p, 'utf8')

    intl = JSON.parse(data) as Intl

    return intl
  } catch (err) {
    logger.error(
      'intl.error',
      `Unable to load intl for locale "${locale}", reverting to default en-US`,
      err
    )

    return getLocaleJSON('en-US')
  }
}

export const getIntl = async () => {
  const locale = await osLocale()

  if (intl != null && locale === intl.locale) {
    return intl
  }

  return getLocaleJSON(locale)
}
