import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger/LoggerInterface';

export function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${req.method}] ${req.originalUrl} - IP: ${req.ip}`);
    next();
  };
}