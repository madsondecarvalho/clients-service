import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { CreateClientUseCase } from '../usecases/client/createClient';
import { AppLogger } from '../logger/AppLogger';

const logger = new AppLogger();
const clientRepo = new ClientRepositoryImpl();

const createClientUseCase = new CreateClientUseCase(clientRepo, logger);

export async function handleCreateClient(message: any) {
  await createClientUseCase.execute(message);
}