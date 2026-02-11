import app from './app.js';
import { config } from './config/index.js';
import { connectMongo } from './config/mongo.js';

async function start(): Promise<void> {
  await connectMongo();
  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
