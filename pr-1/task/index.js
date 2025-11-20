const path = require('path');
const Logger = require('./utils/logger');
const StudentService = require('./services/studentService');
const BackupManager = require('./services/backupManager');
const BackupReporter = require('./services/backupReporter');

const logger = new Logger();
const service = new StudentService(logger);

const dataFile = path.join(__dirname, 'data', 'students.json');
const backupDir = path.join(__dirname, 'data', 'backups');

// Wire events to track operations on students
function wireStudentEvents() {
  service.on('student:added', student => {
    logger.log('EVENT student:added', student);
  });

  service.on('student:removed', student => {
    logger.log('EVENT student:removed', student);
  });

  service.on('students:loaded', info => {
    logger.log(`EVENT students:loaded count=${info.count} from ${info.filePath}`);
  });

  service.on('students:saved', info => {
    logger.log(`EVENT students:saved count=${info.count} to ${info.filePath}`);
  });
}

// Wire backup events for monitoring backup operations
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

async function main() {
  wireStudentEvents();

  // Load the student data from file or create an empty list if not found
  const loaded = await service.loadFromFile(dataFile);
  if (!loaded) {
    logger.log('students.json not found — creating an empty list');
    await service.saveToFile(dataFile);
  }

  const backupManager = new BackupManager(service, {
    backupDir,
    intervalMs: 10000,
    logger,
  });

  wireBackupEvents(backupManager);

  await backupManager.start();

  setTimeout(() => {
    backupManager.stop();
    logger.log('Backup process stopped after demonstration.');
  }, 30000);

  /* DEMONSTRATION OF FUNCTIONALITY */

  // Example of adding new students
  // const s1 = service.addStudent('Tom', 22, 1);
  // const s2 = service.addStudent('Alice', 19, 2);
  // logger.log('Added new students:', s1, s2);

  // Remove a student and log
  // service.removeStudent(s1.id);

  // Fetch student by ID and log
  // const existing = service.getStudentById('1');
  // logger.log('Student with id=1:', existing);

  // Get all students from group 2
  // const group2 = service.getStudentsByGroup(2);
  // logger.log('Students in group 2:', group2);

  // Save and reload data from file
  // await service.saveToFile(dataFile);
  // await service.loadFromFile(dataFile);
  // logger.log('Reloaded from file:', service.getAllStudents());


  logger.log('All students:', service.getAllStudents());
  logger.log('Average age:', service.calculateAverageAge());

  const reporter = new BackupReporter(logger);
  setTimeout(async () => {
    await reporter.generateReport(backupDir);
  }, 20000);
}

main().catch(err => {
  logger.log('Fatal error in main:', err.message || err);
  process.exit(1);
});
