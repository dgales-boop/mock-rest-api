import mongoose from 'mongoose';
import { config } from './index.js';

export async function connectMongo(): Promise<void> {
  await mongoose.connect(config.mongoUri);
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
