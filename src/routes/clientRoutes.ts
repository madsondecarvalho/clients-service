import { Router } from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController';

const router = Router();

router.post('/client', createClient);
router.get('/client', getAllClients);
router.get('/client/:id', getClientById);
router.put('/client/:id', updateClient);
router.delete('/client/:id', deleteClient);

export default router;
