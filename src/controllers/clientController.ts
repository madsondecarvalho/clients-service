import { RequestHandler   } from 'express';
import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { GetAllClientsUseCase } from '../usecases/client/getAllClients';
import { GetClientByIdUseCase } from '../usecases/client/getClientById';
import { UpdateClientUseCase } from '../usecases/client/updateClient';
import { DeleteClientUseCase } from '../usecases/client/deleteClient';
import { KafkaEventPublisher } from '../services/KafkaEventPublisher';

const eventPublisher : KafkaEventPublisher = new KafkaEventPublisher(['localhost:9092']);

const clientRepo = new ClientRepositoryImpl();
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepo);
const getClientByIdUseCase = new GetClientByIdUseCase(clientRepo);
const updateClientUseCase = new UpdateClientUseCase(clientRepo);
const deleteClientUseCase = new DeleteClientUseCase(clientRepo);

export const createClient: RequestHandler = async (req, res) => {
  try {
    const client = req.body; //TODO ADICIONAR VALIDAÇÃO

    await eventPublisher.publish('CREATE_CLIENT', client);

    res.status(201).json({message: 'O cliente será criado. ', client});
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Erro inesperado' });
    }
  }
};

export const getAllClients: RequestHandler = async (_req, res) => {
  const clients = await getAllClientsUseCase.execute();
  res.json(clients);
};

export const getClientById: RequestHandler = async (req, res) => {
  try {
    const client = await getClientByIdUseCase.execute(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client não encontrado' });
      return;
    }
    res.json(client);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
};

export const updateClient: RequestHandler = async (req, res) => {
  try {
    const client = await updateClientUseCase.execute(req.params.id, req.body);
    if (!client) {
      res.status(404).json({ error: 'Client não encontrado' });
      return;
    }
    res.json(client);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'ID inválido' });
    }
  }
};

export const deleteClient: RequestHandler = async (req, res) => {
  try {
    const deleted = await deleteClientUseCase.execute(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Client não encontrado' });
      return;
    }
    res.sendStatus(204);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'ID inválido' });
    }
  }
};
