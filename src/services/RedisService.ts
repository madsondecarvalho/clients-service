import Redis from 'ioredis';
import logger from '../utils/logger';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => logger.info('Redis connected'));
    this.client.on('error', (err) => logger.error('Redis error: %o', err));
    this.client.on('close', () => logger.warn('Redis connection closed'));
  }

  async get(key: string): Promise<string | null> {
    logger.info(`Getting key from Redis: ${key}`);
    return this.client.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      logger.info(`Setting key in Redis: ${key} (expires in ${expireSeconds}s)`);
      await this.client.set(key, value, 'EX', expireSeconds);
    } else {
      logger.info(`Setting key in Redis: ${key}`);
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    logger.info(`Deleting key from Redis: ${key}`);
    await this.client.del(key);
  }
}

export const redisService = new RedisService();