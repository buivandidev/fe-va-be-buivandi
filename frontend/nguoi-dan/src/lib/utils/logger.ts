/**
 * Logger utility - Only logs in development mode
 * Prevents sensitive data leakage in production
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args)
  },
  
  error: (...args: any[]) => {
    if (isDev) console.error(...args)
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args)
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args)
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args)
  },
}
