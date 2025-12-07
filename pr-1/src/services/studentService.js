const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const Student = require('../models/student');
const { saveToJSON, loadJSON } = require('../utils/io');

/**
 * Service that manages Student entities: creating, removing, filtering,
 * and persisting them to a JSON file.
 *
 * Emits events:
 * - 'student:added'    (student)
 * - 'student:removed'  (student)
 * - 'student:updated'  (student)
 * - 'students:loaded'  ({ count, filePath })
 * - 'students:saved'   ({ count, filePath })
 * - 'students:replaced'({ count })
 */
class StudentService extends EventEmitter {
  /**
   * @param {object} logger Logger instance with a `.log()` method.
   */
  constructor(logger) {
    super();
    if (!logger) {
      throw new Error('Logger instance required');
    }
    this.logger = logger;
    this.students = [];
  }

  // CRUD OPERATIONS

  /**
   * Add a new student to the list.
   * @param {string} name
   * @param {number} age
   * @param {string|number} group
   * @returns {Student}
   */
  addStudent(name, age, group) {
    if (!name || typeof name !== 'string') throw new TypeError('Invalid name');
    if (typeof age !== 'number' || !Number.isInteger(age) || age <= 0) {
      throw new TypeError('Age must be a positive integer');
    }

    const id = String(Date.now());
    const student = new Student(id, name, Number(age), group);

    this.students.push(student);
    this.logger.log(`Added student: ${student.name} (${student.id})`);
    this.emit('student:added', student);

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
    this.emit('student:removed', removed);

    return true;
  }

  /**
   * Update existing student by ID.
   * @param {string} id
   * @param {{ name?: string, age?: number, group?: string|number }} updates
   * @returns {Student|null}
   */
  updateStudent(id, updates) {
    const student = this.getStudentById(id);
    if (!student) return null;

    if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
      const name = updates.name;
      if (!name || typeof name !== 'string') {
        throw new TypeError('Invalid name');
      }
      student.name = name;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'age')) {
      const age = updates.age;
      if (typeof age !== 'number' || !Number.isInteger(age) || age <= 0) {
        throw new TypeError('Age must be a positive integer');
      }
      student.age = age;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'group')) {
      student.group = updates.group;
    }

    this.logger.log(`Updated student: ${student.name} (${student.id})`);
    this.emit('student:updated', student);

    return student;
  }

  /**
   * Replace whole students collection with a new one.
   * @param {Array<{ id?: string, name: string, age: number, group: string|number }>} studentsData
   * @returns {Student[]}
   */
  replaceAllStudents(studentsData) {
    if (!Array.isArray(studentsData)) {
      throw new TypeError('studentsData must be an array');
    }

    const newList = [];

    for (const item of studentsData) {
      if (!item || !item.name) {
        throw new TypeError('Each student must have a name');
      }
      if (typeof item.age !== 'number' || !Number.isInteger(item.age) || item.age <= 0) {
        throw new TypeError('Age must be a positive integer');
      }

      const id = item.id ? String(item.id) : String(Date.now() + Math.random());
      const name = String(item.name);
      const age = Number(item.age);
      const group = item.group;

      newList.push(new Student(id, name, age, group));
    }

    this.students = newList;
    this.logger.log(`Replaced students collection with ${newList.length} students`);
    this.emit('students:replaced', { count: newList.length });

    return this.getAllStudents();
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

  // FILE OPERATIONS (ASYNC)

  /**
   * Save the current list of students to a JSON file asynchronously.
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  async saveToFile(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    const plainList = this.students.map(s => ({
      id: s.id,
      name: s.name,
      age: s.age,
      group: s.group,
    }));

    await saveToJSON(plainList, filePath);
    this.logger.log(`Saved ${plainList.length} students to ${filePath}`);
    this.emit('students:saved', { count: plainList.length, filePath });
  }

  /**
   * Load students from a JSON file and replace the current list.
   * @param {string} filePath
   * @returns {Promise<boolean>} false if file does not exist, true otherwise
   */
  async loadFromFile(filePath) {
    const raw = await loadJSON(filePath);
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

      if (!Number.isFinite(age) || age <= 0 || !Number.isInteger(age)) {
        this.logger.log('Skipping entry with invalid age:', item);
        continue;
      }

      this.students.push(new Student(id, name, age, item.group));
      count++;
    }

    this.logger.log(`Loaded ${count} students from ${filePath}`);
    this.emit('students:loaded', { count, filePath });

    return true;
  }
}

module.exports = StudentService;
