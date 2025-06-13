import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { CreateClientUseCase } from '../usecases/client/createClient';

const clientRepo = new ClientRepositoryImpl();
const createClientUseCase = new CreateClientUseCase(clientRepo);

export async function handleCreateClient(message: any) {
  await createClientUseCase.execute(message);
}