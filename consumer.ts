import mongoose from 'mongoose';
import { KafkaEventConsumer } from './src/services/KafkaEventConsumer';
import { handleCreateClient } from './src/consumers/createClientConsumer';

async function bootstrap() {
    await mongoose.connect('mongodb://localhost:27017/seubanco'); // ajuste para seu banco
    console.log('✅MongoDB conectado');

    const kafkaConsumer = new KafkaEventConsumer(['localhost:9092'], 'create-client-group');
    await kafkaConsumer.consume('CREATE_CLIENT', handleCreateClient);
    console.log('Consumer iniciado e ouvindo o tópico CREATE_CLIENT');
}

bootstrap();