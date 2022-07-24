import { ChildProcess, spawn } from 'node:child_process'
import { AddressInfo } from 'node:net'
import electron from 'electron'
import { build, createServer } from 'vite'

let electronProcess: ChildProcess | null = null

const server = await createServer({
  configFile: 'src/renderer/vite.config.ts',
})

await server.listen()

const env = Object.assign(process.env, {
  DEV_SERVER_PORT: (server.httpServer?.address() as AddressInfo).port,
})

const startElectron = {
  name: 'electron-main-watcher',
  writeBundle() {
    electronProcess && electronProcess.kill()
    electronProcess = spawn(electron as unknown as string, ['.'], {
      stdio: 'inherit',
      env,
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
