import mongoose from 'mongoose';
import { KafkaEventConsumer } from './src/services/KafkaEventConsumer';
import { handleCreateClient } from './src/consumers/createClientConsumer';
import { AppLogger } from './src/logger/AppLogger';

const logger = new AppLogger();

async function bootstrap() {
    await mongoose.connect('mongodb://localhost:27017/clients-service');
    logger.info('✅ MongoDB connected');

    const kafkaConsumer = new KafkaEventConsumer(['localhost:9092'], 'create-client-group', logger);
    await kafkaConsumer.consume('CREATE_CLIENT', handleCreateClient);
    logger.info('Consumer started and listening to topic CREATE_CLIENT');
}

bootstrap();