import { ChildProcess, spawn } from 'node:child_process'
import electron from 'electron'
import { build, createServer } from 'vite'

let electronProcess: ChildProcess | null = null

const startElectron = {
  name: 'electron-main-watcher',
  writeBundle() {
    electronProcess && electronProcess.kill()
    electronProcess = spawn(electron as unknown as string, ['.'], {
      stdio: 'inherit',
    })
  },
}

const opts = {
  mode: 'development',
  build: {
    watch: {},
  },
}

await build({
  ...opts,
  configFile: 'src/main/vite.config.ts',
  plugins: [startElectron],
})

await build({
  ...opts,
  configFile: 'src/preload/vite.config.ts',
})

const server = await createServer({
  configFile: 'src/renderer/vite.config.ts',
})

await server.listen()
