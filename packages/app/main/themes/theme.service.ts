import fs from 'node:fs/promises'
import path from 'node:path'
import logger from 'logger'
import { ConfigService } from '@rln/api/services'
import { Theme } from '@rln/shared/types'
import { distRoot } from '~/config'

const root = path.join(distRoot, 'theme')
const configService = new ConfigService()

export const get = async () => {
  const themeName = configService.get<string>('theme.name')

  logger.debug('theme.get', `Found theme "${themeName}"`)

  const [dir, name] = themeName.split('.')
  const file = path.resolve(root, dir, name + '.json')

  const data = (await fs.readFile(file)).toString()

  logger.info('theme.get', `Loaded theme "${themeName}"`)

  return JSON.parse(data) as Theme
}
