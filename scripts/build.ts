import process from 'node:process'
import chalk from 'chalk'
import { build } from 'vite'

const buildMsg = (app: string, isElectronApp = true) => {
  return `\n${chalk.dim('Building:')} ${chalk.bold.blueBright(
    `${isElectronApp ? 'electron' : ''} ${app}`
  )}\n`
}

const buildApp = async (app: string) => {
  console.log(buildMsg(app, true))
  await build({
    configFile: `packages/${app}/vite.config.ts`,
  })
}

const apps = ['api', 'app/main', 'app/renderer', 'app/preload', 'svc']

for (const app of apps) {
  await buildApp(app)
}

console.log(`\n${chalk.bold.greenBright('Build Complete!')}\n`)

process.exit(0)
