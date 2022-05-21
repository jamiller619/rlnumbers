declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      ROOT: string
      RRROCKET_VERSION: string
    }
  }
}

export {}
