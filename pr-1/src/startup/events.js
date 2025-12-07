// src/startup/events.js
const logger = require('../utils/loggerInstance');

/**
 * Subscribes the system to StudentService events
 */
function wireStudentEvents(studentService) {
  studentService.on('student:added', student => {
    logger.log('EVENT student:added', student);
  });

  studentService.on('student:removed', student => {
    logger.log('EVENT student:removed', student);
  });

  studentService.on('student:updated', student => {
    logger.log('EVENT student:updated', student);
  });

  studentService.on('students:loaded', info => {
    logger.log(`EVENT students:loaded count=${info.count} from ${info.filePath}`);
  });

  studentService.on('students:saved', info => {
    logger.log(`EVENT students:saved count=${info.count} to ${info.filePath}`);
  });

  studentService.on('students:replaced', info => {
    logger.log(`EVENT students:replaced count=${info.count}`);
  });
}

/**
 * Subscribes the system to BackupManager events
 */
function wireBackupEvents(backupManager) {
  backupManager.on('backup:success', info => {
    logger.log(`Backup completed: ${info.filePath} (${info.count} students)`);
  });

  backupManager.on('backup:error', err => {
    logger.log('Backup error:', err.message || err);
  });

  backupManager.on('backup:skipped', info => {
    logger.log('Backup skipped:', info.reason);
  });
}

module.exports = {
  wireStudentEvents,
  wireBackupEvents
};
