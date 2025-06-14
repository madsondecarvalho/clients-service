import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import clientRoutes from './routes/clientRoutes';
import { redisService } from './services/RedisService';

import 'dotenv/config';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// conectar ao Mongo
connectDB();

redisService
  .set('healthcheck', 'ok', 10)
  .then(() => redisService.get('healthcheck'))
  .then((value) => {
    if (value === 'ok') {
      console.log('✅ Conexão com Redis estabelecida!');
    } else {
      console.error('⚠️ Falha ao validar conexão com Redis.');
    }
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao Redis:', err);
  });


// rotas
app.use('/api', clientRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// start server
app.listen(PORT, () =>
  console.log(`🚀 Server rodando em http://localhost:${PORT}/api`)
);
