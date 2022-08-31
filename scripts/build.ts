import process from 'node:process'
import chalk from 'chalk'
import { build } from 'vite'

const buildMsg = (app: string) => {
  return `\n${chalk.dim('Building:')} ${chalk.bold.blueBright(app)}\n`
}

const buildApp = async (app: string) => {
  console.log(buildMsg(app))

  await build({
    configFile: `packages/${app}/vite.config.ts`,
  })
}

const electron = ['app/main', 'app/renderer', 'app/preload']

const apps = ['svc', ...electron]

for (const app of apps) {
  await buildApp(app)
}

console.log(`\n${chalk.bold.greenBright('Build Complete!')}\n`)

process.exit(0)
