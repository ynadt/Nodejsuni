const path = require('path');
const Logger = require('./utils/logger');
const StudentService = require('./services/studentService');

// Initialize logger which reads CLI flags (--verbose / --quiet)
const logger = new Logger();

// Create StudentService instance and inject logger
const service = new StudentService(logger);

// Path to JSON file with students data
const dataFile = path.join(__dirname, 'data', 'students.json');

/**
 * Load students from JSON file.
 * If the file does not exist, create an empty one
 */
const loaded = service.loadFromFile(dataFile);

if (!loaded) {
  logger.log('students.json not found — creating an empty list');
  service.saveToFile(dataFile);
}

logger.log('All students:', service.getAllStudents());
logger.log('Average age:', service.calculateAverageAge());
