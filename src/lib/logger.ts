type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export const logger = {
  debug: (message: string, ...args: any[]) => log('DEBUG', message, ...args),
  info: (message: string, ...args: any[]) => log('INFO', message, ...args),
  warn: (message: string, ...args: any[]) => log('WARN', message, ...args),
  error: (message: string, ...args: any[]) => log('ERROR', message, ...args),
};

function log(level: LogLevel, message: string, ...args: any[]) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (level === 'ERROR') {
    console.error(`${prefix} ${message}`, ...args);
  } else if (level === 'WARN') {
    console.warn(`${prefix} ${message}`, ...args);
  } else {
    console.log(`${prefix} ${message}`, ...args);
  }
}
