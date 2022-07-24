import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import merge from '../../vite.config.shared'

const config: UserConfig = {
  root: __dirname,
  plugins: [react()],
  build: {
    outDir: '../../dist',
    target: 'es2022',
  },
}

export default merge(config)
