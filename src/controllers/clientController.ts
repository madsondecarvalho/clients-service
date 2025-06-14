import { RequestHandler } from 'express';
import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { GetAllClientsUseCase } from '../usecases/client/getAllClients';
import { GetClientByIdUseCase } from '../usecases/client/getClientById';
import { UpdateClientUseCase } from '../usecases/client/updateClient';
import { DeleteClientUseCase } from '../usecases/client/deleteClient';
import { CreateClientMessageUseCase } from '../usecases/client/createClientMessage';
import { KafkaEventPublisher } from '../services/KafkaEventPublisher';
import { clientSchema } from '../validators/clientSchema';
import { RedisService } from '../services/RedisService';
import { AppLogger } from '../logger/AppLogger';

//logger for dependency injection
const logger = new AppLogger();

//redis for dependency injection
const redisService = new RedisService(logger);

//kafka event publisher for dependency injection
const eventPublisher: KafkaEventPublisher = new KafkaEventPublisher(['localhost:9092']);

//repositories and use cases for dependency injection
const clientRepo = new ClientRepositoryImpl();

// Use cases
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepo, logger);
const getClientByIdUseCase = new GetClientByIdUseCase(clientRepo, redisService, logger);
const updateClientUseCase = new UpdateClientUseCase(clientRepo, logger);
const deleteClientUseCase = new DeleteClientUseCase(clientRepo, logger);
const createClientMessageUseCase = new CreateClientMessageUseCase(eventPublisher, clientRepo, logger);

export const createClient: RequestHandler = async (req, res) => {
  try {
    const parseResult = clientSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ message: "Validation Error", data: parseResult.error.errors });
      return;
    }

    const client = parseResult.data;

    const createClientMessage = await createClientMessageUseCase.execute(client)

    res.status(201).json(createClientMessage);
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
    const parseResult = clientSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ message: "Validation Error", data: parseResult.error.errors });
      return;
    }

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
