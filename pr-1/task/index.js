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

/* -----------------------------------------
   DEMONSTRATION OF FUNCTIONALITY
----------------------------------------- */

// 1. Add new students
// const s1 = service.addStudent('Tom', 22, 1);
// const s2 = service.addStudent('Alice', 19, 2);
// logger.log('Added new students:', s1, s2);
//
// // 2. Remove a student by ID
// service.removeStudent(s1.id);
//
// // 3. Get student by ID
// const existing = service.getStudentById('1');
// logger.log('Student with id=1:', existing);
//
// // 4. Filter students by group
// const group2 = service.getStudentsByGroup(2);
// logger.log('Students in group 2:', group2);
//
// // 5. Save updated list to file
// service.saveToFile(dataFile);
//
// // 6. Reload file to verify persistence
// service.loadFromFile(dataFile);
// logger.log('Reloaded from file:', service.getAllStudents());


logger.log('All students:', service.getAllStudents());
logger.log('Average age:', service.calculateAverageAge());
