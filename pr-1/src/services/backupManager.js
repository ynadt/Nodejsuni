const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const { saveToJSON } = require('../utils/io');

const BACKUP_INTERVAL_MS = 10000;

/**
 * Periodic backup manager for students data.
 * Uses setInterval to trigger backups and protects from stacking
 * unfinished I/O operations.
 * Emits:
 * - 'backup:success' ({ filePath, count })
 * - 'backup:error'   (error)
 * - 'backup:skipped' ({ reason })
 */
class BackupManager extends EventEmitter {
  /**
   * @param {import('./studentService')} studentService
   * @param {{ backupDir?: string, intervalMs?: number, logger?: object }} [options]
   */
  constructor(studentService, options = {}) {
    super();
    if (!studentService) {
      throw new Error('StudentService instance required for BackupManager');
    }

    this.studentService = studentService;
    this.backupDir =
      options.backupDir || path.join(__dirname, '..', 'data', 'backups');
    this.intervalMs = options.intervalMs || BACKUP_INTERVAL_MS;

    this.logger = options.logger || (studentService && studentService.logger) || console;

    this.timer = null;
    this.isBackupRunning = false;
    this.pendingIntervals = 0;
  }

  async ensureBackupDir() {
    await fs.mkdir(this.backupDir, { recursive: true });
  }

  async start() {
    if (this.timer) return;

    try {
      await this.ensureBackupDir();
    } catch (err) {
      this.emit('backup:error', err);
      return;
    }

    this.timer = setInterval(() => {
      this.runBackupIteration().catch(err => {
        this.emit('backup:error', err);
      });
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Single backup iteration with protection from stacking I/O.
   * @returns {Promise<void>}
   */
  async runBackupIteration() {
    if (this.isBackupRunning) {
      this.pendingIntervals += 1;

      if (this.pendingIntervals >= 3) {
        const error = new Error('Backup operation stuck for 3 intervals in a row');
        this.emit('backup:error', error);
        throw error;
      }

      this.emit('backup:skipped', { reason: 'Previous backup is still in progress' });
      return;
    }

    this.isBackupRunning = true;
    this.pendingIntervals = 0;

    try {
      const students = this.studentService.getAllStudents();
      const timestamp = Date.now();
      const fileName = `students-${timestamp}.backup.json`;
      const filePath = path.join(this.backupDir, fileName);

      await this.performBackup(students, filePath);

      this.emit('backup:success', { filePath, count: students.length });
    } catch (err) {
      this.emit('backup:error', err);
    } finally {
      this.isBackupRunning = false;
    }
  }

  /**
   * Performs the backup operation, saving students to a JSON file.
   * @param {Array} students - List of students to back up.
   * @param {string} filePath - Path where the backup file will be stored.
   */
  async performBackup(students, filePath) {
    await saveToJSON(students, filePath);
  }
}

module.exports = BackupManager;
