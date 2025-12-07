const backupManager = require('../services/backupManagerInstance');
const BackupReporter = require('../services/backupReporter');
const paths = require('../config/paths');
const logger = require('../utils/loggerInstance');

const reporter = new BackupReporter(logger);

exports.start = async (req, res) => {
  try {
    await backupManager.start();
    res.status(200).json({ status: 'running' });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
};

exports.stop = (req, res) => {
  backupManager.stop();
  res.status(200).json({ status: 'stopped' });
};

exports.status = (req, res) => {
  res.status(200).json({
    status: backupManager.timer ? 'running' : 'stopped',
    isBackupRunning: backupManager.isBackupRunning,
    pendingIntervals: backupManager.pendingIntervals,
    intervalMs: backupManager.intervalMs
  });
};

exports.report = async (req, res) => {
  try {
    const result = await reporter.generateReport(paths.BACKUP_DIR);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
};
