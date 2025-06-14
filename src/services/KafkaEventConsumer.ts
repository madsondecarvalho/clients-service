import { Kafka, Consumer } from 'kafkajs';
import { Logger } from '../logger/LoggerInterface';

export class KafkaEventConsumer {
  private consumer: Consumer;
  private logger: Logger;

  constructor(brokers: string[], groupId: string, logger: Logger) {
    const kafka = new Kafka({ brokers });
    this.consumer = kafka.consumer({ groupId });
    this.logger = logger;
  }

  async consume(topic: string, handler: (message: any) => Promise<void>) {
    try {
      await this.consumer.connect();
      this.logger.info(`Kafka consumer connected to the broker`);

      await this.consumer.subscribe({ topic, fromBeginning: true });
      this.logger.info(`Subscribed to topic: ${topic}`);

      await this.consumer.run({
        eachMessage: async ({ message, partition }) => {
          if (message.value) {
            this.logger.info(
              `Received message on topic ${topic} (partition ${partition})`
            );
            await handler(JSON.parse(message.value.toString()));
          }
        },
      });
    } catch (error) {
      this.logger.error('Kafka consumer error: %o', error);
      throw error;
    }
  }
}