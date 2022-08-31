import { build } from 'vite'
import { restart } from 'vite-tools'

await build({
  mode: 'development',
  configFile: 'packages/svc/vite.config.ts',
  plugins: [
    restart('node', [
      '-r',
      'dotenv/config',
      'dist/svc/index.js',
      process.argv?.[2],
    ]),
  ],
  build: {
    watch: {},
  },
})
