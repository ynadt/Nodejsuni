const service = require('../services/studentServiceInstance');
const { DATA_FILE } = require('../config/paths');
const logger = require('../utils/loggerInstance');

exports.loadInitialData = async () => {
  const ok = await service.loadFromFile(DATA_FILE);
  if (!ok) {
    logger.log('students.json not found — creating...');
    await service.saveToFile(DATA_FILE);
  }
};
