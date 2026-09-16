import mongoose from 'mongoose';
import { config } from '../config';

export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongodbUri);
  console.log('[db] connected to MongoDB');
}

export async function disconnectDb(): Promise<void> {
  await mongoose.connection.close();
  console.log('[db] connection closed');
}
