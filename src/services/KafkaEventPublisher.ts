import { Kafka, Producer, Partitioners} from 'kafkajs';
import { EventPublisher } from './EventPublisher';

export class KafkaEventPublisher implements EventPublisher {
  private producer: Producer;

  constructor(brokers: string[]) {
    const kafka = new Kafka({ brokers });
    this.producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner
    });
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await this.producer.disconnect();
  }
}