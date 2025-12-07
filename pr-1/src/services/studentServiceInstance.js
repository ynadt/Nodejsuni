const StudentService = require('./studentService');
const logger = require('../utils/loggerInstance');

module.exports = new StudentService(logger);
