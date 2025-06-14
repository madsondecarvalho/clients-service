import { Kafka, Consumer } from 'kafkajs';
import logger from '../utils/logger';

export class KafkaEventConsumer {
  private consumer: Consumer;

  constructor(brokers: string[], groupId: string) {
    const kafka = new Kafka({ brokers });
    this.consumer = kafka.consumer({ groupId });
  }

  async consume(topic: string, handler: (message: any) => Promise<void>) {
    try {
      await this.consumer.connect();
      logger.info(`Kafka consumer connected to the broker`);

      await this.consumer.subscribe({ topic, fromBeginning: true });
      logger.info(`Subscribed to topic: ${topic}`);

      await this.consumer.run({
        eachMessage: async ({ message, partition }) => {
          if (message.value) {
            logger.info(
              `Received message on topic ${topic} (partition ${partition})`
            );
            await handler(JSON.parse(message.value.toString()));
          }
        },
      });
    } catch (error) {
      logger.error('Kafka consumer error: %o', error);
      throw error;
    }
  }
}