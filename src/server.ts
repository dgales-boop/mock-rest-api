import app from './app';
import { config } from './config/index';

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});
