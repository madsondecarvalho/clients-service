// src/index.ts
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import clientRoutes from './routes/clientRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// conectar ao Mongo
connectDB();

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
