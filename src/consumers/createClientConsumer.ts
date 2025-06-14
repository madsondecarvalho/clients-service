import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { CreateClientUseCase } from '../usecases/client/createClient';
import { AppLogger } from '../logger/AppLogger';
import { RedisService } from '../services/RedisService';

const logger = new AppLogger();
const redisService = new RedisService(logger);
const clientRepo = new ClientRepositoryImpl();

const createClientUseCase = new CreateClientUseCase(clientRepo,redisService, logger);

export async function handleCreateClient(message: any) {
  await createClientUseCase.execute(message);
}