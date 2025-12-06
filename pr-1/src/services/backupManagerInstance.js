const BackupManager = require('./backupManager');
const paths = require('../config/paths');
const logger = require('../utils/loggerInstance');
const studentService = require('./studentServiceInstance');

module.exports = new BackupManager(studentService, {
  backupDir: paths.BACKUP_DIR,
  intervalMs: paths.BACKUP_INTERVAL_MS,
  logger
});
