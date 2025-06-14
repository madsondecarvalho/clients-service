import winstonLogger from './WinstonLogger';
import { Logger } from './LoggerInterface';

export class AppLogger implements Logger {
  info(message: string, ...meta: any[]): void {
    winstonLogger.info(message, ...meta);
  }
  warn(message: string, ...meta: any[]): void {
    winstonLogger.warn(message, ...meta);
  }
  error(message: string, ...meta: any[]): void {
    winstonLogger.error(message, ...meta);
  }
}