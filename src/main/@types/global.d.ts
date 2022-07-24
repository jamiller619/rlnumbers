declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      RRROCKET_VERSION: string
      RAPID_API_KEY: string
    }
  }
}

export {}
