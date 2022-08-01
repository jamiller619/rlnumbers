import * as winston from 'winston'

const fileOptions: winston.transports.FileTransportOptions = {
  level: 'info',
  filename: './logs/rlnumbers.log',
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
}

const consoleOptions: winston.transports.ConsoleTransportOptions = {
  level: 'debug',
  handleExceptions: true,
}

const timestamp = winston.format.timestamp({
  format: 'YYYY.MM.DD HH:mm:ss',
})

const format = winston.format.printf(
  ({ level, message, label, timestamp, ...meta }) => {
    return `${timestamp} [${label}] ${level}: ${message} ${
      Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''
    }`
  }
)

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(timestamp, format),
  transports: [
    new winston.transports.File(fileOptions),
    new winston.transports.Console(consoleOptions),
  ],
  exitOnError: false,
})

export default {
  info: (namespace: string, message: unknown, ...args: unknown[]) => {
    return logger.info({ message, label: namespace, ...args })
  },

  error: (namespace: string, message: unknown, err?: unknown) => {
    return logger.error({
      message,
      label: namespace,
      err: {
        message: (err as Error)?.message ?? 'none',
        stack: (err as Error)?.stack ?? 'none',
      },
    })
  },

  debug: (namespace: string, message: unknown, ...args: unknown[]) => {
    return logger.debug({ message, label: namespace, ...args })
  },

  warn: (namespace: string, message: unknown, ...args: unknown[]) => {
    return logger.warn({ message, label: namespace, ...args })
  },

  log: (
    level: string,
    namespace: string,
    message: unknown,
    ...args: unknown[]
  ) => {
    return logger.log(level, { message, label: namespace, ...args })
  },
}
