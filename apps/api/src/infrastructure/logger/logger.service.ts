import type { AppConfig, LoggerLike } from '../../core/types/api.types.js';

type LogLevel = 'audit' | 'debug' | 'error' | 'info' | 'warn';

export class LoggerService implements LoggerLike {
  constructor(private readonly config: AppConfig) {}

  audit(message: string, context?: Record<string, unknown>): void {
    this.write('audit', message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.config.env !== 'production') {
      this.write('debug', message, context);
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.write('error', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.write('warn', message, context);
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry = {
      app: this.config.name,
      context,
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    const line = JSON.stringify(entry);

    if (level === 'error') {
      console.error(line);
      return;
    }

    console.log(line);
  }
}
