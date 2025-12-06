const backupManager = require('../services/backupManagerInstance');
const logger = require('../utils/loggerInstance');

exports.startBackup = async () => {
  await backupManager.start();
  logger.log('Backup manager started');
};
