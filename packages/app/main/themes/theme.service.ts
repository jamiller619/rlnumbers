import fs from 'node:fs/promises'
import path from 'node:path'
import { Theme } from '@rln/shared/types'
import { configService } from '~/config'
import logger from '~/logger'

const root = path.resolve('dist/themes')

export const get = async () => {
  const themeName = configService.get<string>('theme.name')

  logger.debug('theme.get', `Found theme "${themeName}"`)

  const [dir, name] = themeName.split('.')
  const file = path.resolve(root, dir, name + '.json')

  const data = (await fs.readFile(file)).toString()

  logger.info('theme.get', `Loaded theme "${themeName}"`)

  return JSON.parse(data) as Theme
}
