import { spawn } from 'node:child_process'
import { AddressInfo } from 'node:net'
import { platform } from 'node:os'
import electron from 'electron'
import { build, createServer } from 'vite'
import { restart } from 'vite-tools'

const server = await createServer({
  configFile: 'packages/app/renderer/vite.config.ts',
})

await server.listen()

const env = Object.assign(process.env, {
  DEV_SERVER_PORT: (server.httpServer?.address() as AddressInfo).port,
})

const opts = {
  mode: 'development',
  build: {
    watch: {},
  },
}

await build({
  ...opts,
  configFile: 'packages/app/main/vite.config.ts',
  plugins: [
    restart(electron as unknown as string, ['packages/app'], {
      env,
    }),
  ],
})

await build({
  ...opts,
  configFile: 'packages/app/preload/vite.config.ts',
})

const cmd = platform() === 'win32' ? 'yarn.cmd' : 'yarn'

spawn(cmd, ['build:theme', '--watch'], {
  stdio: 'inherit',
})
