import fs from 'node:fs/promises'
import path from 'node:path'
import { Intl } from '@shared/types'
import * as configService from '~/config/config.service'
import logger from '~/utils/logger'

let intl: Intl | null = null
const root = path.resolve('./dist/locales')

export const getIntl = async () => {
  const locale = await configService.get('locale')

  try {
    if (intl != null && locale === intl.locale) {
      return intl
    }

    const p = path.resolve(root, `${locale}.json`)
    const data = await fs.readFile(p, 'utf8')

    intl = JSON.parse(data) as Intl

    return intl
  } catch (err) {
    logger.error('intl.error', `Unable to load Intl file for "${locale}"`, err)
  }
}
