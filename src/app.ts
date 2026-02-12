import express from 'express';
import v1Router from './routes/v1/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', v1Router);

app.use(errorHandler);

export default app;
