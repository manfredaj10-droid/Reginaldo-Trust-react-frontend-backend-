import app from './src/app.js';
import { ENV } from './src/config/env.js';
import { seedDatabase } from './src/seed/seedData.js';
import { db } from './src/config/db.js';

// Auto-seed initial data on startup if empty
try {
  seedDatabase();
} catch (err) {
  console.warn('[Bootstrap] Seed notice:', err.message);
}

const server = app.listen(ENV.PORT, () => {
  console.log(`===========================================`);
  console.log(` Reginaldo Trust API Server Running`);
  console.log(` Mode:        ${ENV.NODE_ENV}`);
  console.log(` Port:        ${ENV.PORT}`);
  console.log(` Health:      http://localhost:${ENV.PORT}/api/health`);
  console.log(` Database:    ${ENV.DB_PATH}`);
  console.log(`===========================================`);
});

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(() => {
    try {
      db.close();
      console.log('Database connection closed.');
    } catch (e) {
      // already closed
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default server;
