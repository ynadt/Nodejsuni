const path = require('path');

module.exports = {
  DATA_FILE: path.join(__dirname, '../../data/students.json'),
  BACKUP_DIR: path.join(__dirname, '../../data/backups'),
  BACKUP_INTERVAL_MS: 10000
};
