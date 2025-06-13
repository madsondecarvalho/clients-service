// src/controllers/clientController.ts
import { Request, Response, NextFunction, RequestHandler   } from 'express';
import { ClientRepositoryImpl } from '../data/ClientRepositoryImpl';
import { CreateClientUseCase } from '../usecases/client/createClient';
import { GetAllClientsUseCase } from '../usecases/client/getAllClients';
import { GetClientByIdUseCase } from '../usecases/client/getClientById';
import { UpdateClientUseCase } from '../usecases/client/updateClient';
import { DeleteClientUseCase } from '../usecases/client/deleteClient';

const clientRepo = new ClientRepositoryImpl();
const createClientUseCase = new CreateClientUseCase(clientRepo);
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepo);
const getClientByIdUseCase = new GetClientByIdUseCase(clientRepo);
const updateClientUseCase = new UpdateClientUseCase(clientRepo);
const deleteClientUseCase = new DeleteClientUseCase(clientRepo);

export const createClient: RequestHandler = async (req, res) => {
  try {
    const client = await createClientUseCase.execute(req.body);
    res.status(201).json(client);
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
