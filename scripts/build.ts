import chalk from 'chalk'
import { build } from 'vite'

const buildMsg = (app: string) => {
  return `\n${chalk.dim('Building:')} ${chalk.bold.blueBright(
    `electron ${app}`
  )}\n`
}

const buildApp = async (app: string) => {
  console.log(buildMsg(app))
  await build({
    configFile: `packages/app/${app}/vite.config.ts`,
  })
}

for (const app of ['main', 'renderer', 'preload']) {
  await buildApp(app)
}

console.log(`\n${chalk.bold.greenBright('Build Complete!')}\n`)

process.exit(0)
