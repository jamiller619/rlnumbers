import process from 'node:process'

export * as configService from './config.service'

const { NODE_ENV } = process.env

export const isDev = NODE_ENV === 'development'
