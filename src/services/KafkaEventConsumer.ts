import { Kafka, Consumer } from 'kafkajs';

export class KafkaEventConsumer {
  private consumer: Consumer;

  constructor(brokers: string[], groupId: string) {
    const kafka = new Kafka({ brokers });
    this.consumer = kafka.consumer({ groupId });
  }

  async consume(topic: string, handler: (message: any) => Promise<void>) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          await handler(JSON.parse(message.value.toString()));
        }
      },
    });
  }
}