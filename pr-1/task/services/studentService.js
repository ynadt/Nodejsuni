const fs = require('fs');
const path = require('path');
const Student = require('../models/student');
const { saveToJSON, loadJSON } = require('../utils/io');

/**
 * Service that manages Student entities: creating, removing, filtering,
 * and persisting them to a JSON file.
 */
class StudentService {
  /**
   * @param {object} logger - Logger instance with a `.log()` method.
   */
  constructor(logger) {
    if (!logger) {
      throw new Error('Logger instance required');
    }
    this.logger = logger;
    this.students = [];
  }

  // -------------------------------------------------------------
  // CRUD OPERATIONS
  // -------------------------------------------------------------

  /**
   * Add a new student to the list.
   * @param {string} name
   * @param {number} age
   * @param {string|number} group
   * @returns {Student}
   */
  addStudent(name, age, group) {
    if (!name || typeof name !== 'string') throw new TypeError('Invalid name');
    if (!Number.isFinite(age)) throw new TypeError('Invalid age');

    const id = String(Date.now());
    const student = new Student(id, name, Number(age), group);

    this.students.push(student);
    this.logger.log(`Added student: ${student.name} (${student.id})`);

    return student;
  }

  /**
   * Remove a student by ID.
   * @param {string} id
   * @returns {boolean} true if student removed, false if not found
   */
  removeStudent(id) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) {
      this.logger.log(`Student ${id} not found`);
      return false;
    }

    const removed = this.students.splice(idx, 1)[0];
    this.logger.log(`Removed student: ${removed.name} (${removed.id})`);
    return true;
  }

  /**
   * Find student by ID.
   * @param {string} id
   * @returns {Student|null}
   */
  getStudentById(id) {
    return this.students.find(s => s.id === id) || null;
  }

  /**
   * Get all students with matching group value.
   * @param {string|number} group
   * @returns {Student[]}
   */
  getStudentsByGroup(group) {
    return this.students.filter(s => String(s.group) === String(group));
  }

  /**
   * Get a copy of all students.
   * @returns {Student[]}
   */
  getAllStudents() {
    return [...this.students];
  }

  /**
   * Calculate the average age of all students.
   * @returns {number}
   */
  calculateAverageAge() {
    if (this.students.length === 0) return 0;
    const sum = this.students.reduce((acc, s) => acc + Number(s.age), 0);
    return sum / this.students.length;
  }

  // -------------------------------------------------------------
  // FILE OPERATIONS
  // -------------------------------------------------------------

  /**
   * Save the current list of students to a JSON file.
   * @param {string} filePath
   */
  saveToFile(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const plainList = this.students.map(s => ({
      id: s.id,
      name: s.name,
      age: s.age,
      group: s.group,
    }));

    saveToJSON(plainList, filePath);
    this.logger.log(`Saved ${plainList.length} students to ${filePath}`);
  }

  /**
   * Load students from a JSON file and replace the current list.
   * @param {string} filePath
   * @returns {boolean} false if file does not exist, true otherwise
   */
  loadFromFile(filePath) {
    const raw = loadJSON(filePath);
    if (!raw) {
      this.logger.log(`File not found: ${filePath}`);
      return false;
    }

    if (!Array.isArray(raw)) {
      throw new TypeError('Students file must contain an array');
    }

    this.students = [];
    let count = 0;

    for (const item of raw) {
      if (!item || !item.id || !item.name) {
        this.logger.log('Skipping invalid student entry:', item);
        continue;
      }

      const id = String(item.id);
      const name = String(item.name);
      const age = Number(item.age);

      if (!Number.isFinite(age)) {
        this.logger.log('Skipping entry with invalid age:', item);
        continue;
      }

      this.students.push(new Student(id, name, age, item.group));
      count++;
    }

    this.logger.log(`Loaded ${count} students from ${filePath}`);
    return true;
  }
}

module.exports = StudentService;
