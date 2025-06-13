// src/controllers/clientController.ts
import { Request, Response, NextFunction, RequestHandler   } from 'express';
import { Client } from '../models/client';

export const createClient: RequestHandler = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    // NÃO retorno o res.json(), apenas chamo:
    res.status(201).json(client);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Erro inesperado' });
    }
  }
};

// Repita o mesmo padrão para os outros handlers:
export const getAllClients: RequestHandler = async (_req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

export const getClientById: RequestHandler = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client não encontrado' });
      return;
    }
    res.json(client);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// UPDATE
export const updateClient: RequestHandler = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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

export const deleteClient: RequestHandler = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'Client não encontrado' });
      return;
    }
    // Envia status 204 sem corpo
    res.sendStatus(204);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'ID inválido' });
    }
  }
};
