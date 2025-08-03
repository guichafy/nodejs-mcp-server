/**
 * Utilitário de logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = LogLevel.INFO;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(`🐛 [DEBUG] ${new Date().toISOString()} ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.log(`ℹ️ [INFO] ${new Date().toISOString()} ${message}`, ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`⚠️ [WARN] ${new Date().toISOString()} ${message}`, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`❌ [ERROR] ${new Date().toISOString()} ${message}`, ...args);
    }
  }
}