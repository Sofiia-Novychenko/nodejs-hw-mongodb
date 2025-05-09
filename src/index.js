import { setupServer } from './server.js';
import { initMongoDB } from './bd/initMongoConnection.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();
