import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB:', err);
    process.exit(1);
  }
};
