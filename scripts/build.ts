import process from 'node:process'
import chalk from 'chalk'
import { build } from 'vite'

type Env = 'dev' | 'prod' | 'test'

// const env = process.argv[2] as Env

const buildMsg = (app: string, isElectronApp = true) => {
  return `\n${chalk.dim('Building:')} ${chalk.bold.blueBright(
    `${isElectronApp ? 'electron' : ''} ${app}`
  )}\n`
}

console.log(buildMsg('api', false))

await build({
  configFile: `packages/api/vite.config.ts`,
})

const buildApp = async (app: string) => {
  console.log(buildMsg(app, true))
  await build({
    configFile: `packages/app/${app}/vite.config.ts`,
  })
}

for (const app of ['main', 'renderer', 'preload']) {
  await buildApp(app)
}

console.log(buildMsg('svc', false))

await build({
  configFile: `packages/svc/vite.config.ts`,
})

console.log(`\n${chalk.bold.greenBright('Build Complete!')}\n`)

process.exit(0)
