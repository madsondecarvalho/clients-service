import mongoose from 'mongoose';
import { KafkaEventConsumer } from './services/KafkaEventConsumer';
import { handleCreateClient } from './consumers/createClientConsumer';
import { AppLogger } from './logger/AppLogger';

const logger = new AppLogger();

const kafkaBrokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const kafkaGroupId = process.env.KAFKA_GROUP_ID || 'create-client-group';
const CreateClientTopic = process.env.KAFKA_TOPIC || 'CREATE_CLIENT';

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('[kafka-consumer] ✅ MongoDB connected');

    const kafkaConsumer = new KafkaEventConsumer(kafkaBrokers, kafkaGroupId, logger);
    await kafkaConsumer.consume(CreateClientTopic, handleCreateClient);
    logger.info(`✅ Consumer started and listening to topic ${CreateClientTopic}`);
  } catch (err) {
    logger.error('[kafka-consumer] ❌ Error during bootstrap: %o', err);
    process.exit(1);
  }
}

bootstrap();