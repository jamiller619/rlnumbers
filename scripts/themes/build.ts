import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import chokidar from 'chokidar'
import { DefaultTheme } from 'styled-components'
import color from './color.js'
import { create } from './scale.js'

const watch = process.argv.includes('--watch')

if (watch === true) {
  console.log(chalk.blueBright(`Theme build running in watch mode`))
}

const src = path.resolve(
  process.cwd(),
  'packages/app/renderer/style/themes/system'
)
const dest = path.resolve(process.cwd(), 'dist/app/theme/system')

await fs.mkdir(src, { recursive: true })
await fs.mkdir(dest, { recursive: true })

const file = (dir: string) => `${dir}/default.json`

const themeEntriesReducer = (
  theme: DefaultTheme,
  [key, value]: [string | number, unknown]
) => {
  if (Array.isArray(value)) {
    return {
      ...theme,
      [key]: create(value),
    }
  }

  return {
    ...theme,
    [key]: value,
  }
}

const build = async () => {
  const defaultTheme = (await import('./defaultTheme.json')).default
  const themeWithScale = Object.entries(defaultTheme).reduce(
    themeEntriesReducer,
    {} as DefaultTheme
  )

  const theme: DefaultTheme = {
    ...themeWithScale,
    colors: {
      light: color.light,
      dark: color.dark,
      shared: color.shared,
    },
  }

  const json = JSON.stringify(theme, null, 2)

  await fs.writeFile(file(src), json)
  await fs.writeFile(file(dest), json)

  console.log(chalk.greenBright(`Theme build complete`))
}

if (watch) {
  const watcher = chokidar.watch('scripts/themes/defaultTheme.json')

  watcher.on('change', async () => {
    console.log(chalk.blueBright('Theme changed, rebuilding...'))

    await build()
  })
}

await build()
