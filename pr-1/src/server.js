// src/server.js
const app = require('./app');
const { loadInitialData } = require('./startup/initData');
const { startBackup } = require('./startup/initBackup');
const { wireStudentEvents, wireBackupEvents } = require('./startup/events');

const studentService = require('./services/studentServiceInstance');
const backupManager = require('./services/backupManagerInstance');

const { PORT } = require('./config/env');
const logger = require('./utils/loggerInstance');

async function createServer() {
  // 1. Load initial data
  await loadInitialData();

  // 2. Wire up event listeners
  wireStudentEvents(studentService);
  wireBackupEvents(backupManager);

  // 3. Start backup manager
  await startBackup();

  // 4. Start the HTTP server
  app.listen(PORT, () => {
    logger.log(`HTTP server is running on port ${PORT}`);
  });
}

module.exports = createServer;
