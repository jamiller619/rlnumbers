import chalk from 'chalk'
import { build } from 'vite'

console.log(`\n\nBuilding: ${chalk.bold.blueBright('Preload')}\n`)
await build({
  configFile: 'src/preload/vite.config.ts',
})

console.log(`\n\nBuilding: ${chalk.bold.blueBright('Main')}\n`)
await build({
  configFile: 'src/main/vite.config.ts',
})

console.log(`\n\nBuilding: ${chalk.bold.blueBright('Renderer')}\n`)
await build({
  configFile: 'src/renderer/vite.config.ts',
})

console.log(`\n${chalk.bold.greenBright('Build Complete!')}\n`)

process.exit(0)
