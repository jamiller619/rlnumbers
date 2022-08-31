import path from 'node:path'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

const { NODE_ENV } = process.env

export const isDev = NODE_ENV === 'development'
export const distRoot = path.resolve('dist/app')
