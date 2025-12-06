const fs = require('fs').promises;
const path = require('path');

/**
 * BackupReporter reads all backup files and returns a structured report.
 * It logs a short summary and organizes the report into a JavaScript object.
 */
class BackupReporter {
  constructor(logger) {
    this.logger = logger || console;
  }

  /**
   * Generate a report from all *.backup.json files found in backupDir.
   * Returns an object with processed/failed files, latest file info, grouped counts and average.
   * @param {string} backupDir
   * @returns {Promise<object>} report
   */
  async generateReport(backupDir) {
    if (!backupDir || typeof backupDir !== 'string') {
      throw new TypeError('backupDir must be a string');
    }

    await fs.mkdir(backupDir, { recursive: true });

    const backupFiles = await this.getBackupFiles(backupDir);

    const report = {
      totalFiles: backupFiles.length,
      processedFiles: [], // filenames
      failedFiles: [], // { file, error }
      latestFile: null,
      latestTimestamp: null,
      latestDatetime: null,
      grouped: [], // [{ id, amount }]
      averageStudentsPerFile: 0,
    };

    if (backupFiles.length === 0) {
      this.logger.log('Backup report: no backup files found in', backupDir);
      return report;
    }

    const filePromises = backupFiles.map(fileName => this.readBackupFile(path.join(backupDir, fileName)));
    const results = await Promise.all(filePromises);

    const countsById = new Map();
    let totalStudents = 0;
    let processedCount = 0;

    for (const res of results) {
      if (res.error) {
        report.failedFiles.push({ file: res.fileName, error: res.error });
        continue;
      }

      report.processedFiles.push(res.fileName);
      processedCount++;

      // Update latest timestamp/file if present
      if (typeof res.ts === 'number' && !Number.isNaN(res.ts) && (report.latestTimestamp === null || res.ts > report.latestTimestamp)) {
        report.latestTimestamp = res.ts;
        report.latestFile = res.fileName;
        report.latestDatetime = new Date(res.ts).toISOString();
      }

      // Process student data
      const students = Array.isArray(res.students) ? res.students : [];
      totalStudents += students.length;
      for (const s of students) {
        if (!s || typeof s.id === 'undefined') continue;
        const id = String(s.id);
        const current = countsById.get(id) || 0;
        countsById.set(id, current + 1);
      }
    }

    report.grouped = Array.from(countsById.entries()).map(([id, amount]) => ({ id, amount }));

    report.averageStudentsPerFile = processedCount > 0 ? totalStudents / processedCount : 0;

    const summary = [
      `Backup report summary:`,
      `- Total backup files: ${report.totalFiles}`,
      `- Processed backups: ${processedCount}`,
      `- Failed backups: ${report.failedFiles.length}`,
      report.latestFile ? `- Latest backup: ${report.latestFile} at ${report.latestDatetime}` : '',
      `- Average students per processed file: ${report.averageStudentsPerFile}`,
      `- Grouped students by ID (total occurrences in backups):\n${JSON.stringify(report.grouped, null, 2)}`
    ].filter(Boolean).join('\n');

    this.logger.log(summary);

    return report;
  }

  /**
   * Get all backup files in the specified directory.
   * @param {string} backupDir
   * @returns {Promise<string[]>} List of backup file names
   */
  async getBackupFiles(backupDir) {
    const dirEntries = await fs.readdir(backupDir, { withFileTypes: true });
    return dirEntries
      .filter(entry => entry.isFile() && entry.name.endsWith('.backup.json'))
      .map(entry => entry.name);
  }

  /**
   * Read and parse a backup file.
   * @param {string} fullPath - Path to the backup file
   * @returns {Promise<object>} Parsed file data or an error
   */
  async readBackupFile(fullPath) {
    const fileName = path.basename(fullPath);
    const match = fileName.match(/^students-(\d+)\.backup\.json$/);
    const ts = match ? Number(match[1]) : null;

    try {
      const raw = await fs.readFile(fullPath, 'utf8');
      const students = JSON.parse(raw);
      return { fileName, ts, students };
    } catch (err) {
      return { fileName, error: err.message || err };
    }
  }
}

module.exports = BackupReporter;
