const service = require('../services/studentServiceInstance');
const { DATA_FILE } = require('../config/paths');

exports.getAll = (req, res) => {
  res.json(service.getAllStudents());
};

exports.create = (req, res) => {
  const { name, age, group } = req.body;
  try {
    const s = service.addStudent(name, age, group);
    res.status(201).json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAverageAge = (req, res) => {
  res.json({ averageAge: service.calculateAverageAge() });
};

exports.getByGroup = (req, res) => {
  res.json(service.getStudentsByGroup(req.params.id));
};

exports.getById = (req, res) => {
  const student = service.getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json(student);
};

exports.update = (req, res) => {
  try {
    const updated = service.updateStudent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = (req, res) => {
  const removed = service.removeStudent(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Student removed' });
};

exports.saveToFile = async (req, res) => {
  try {
    await service.saveToFile(DATA_FILE);
    res.json({ message: 'Saved', file: DATA_FILE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loadFromFile = async (req, res) => {
  try {
    const loaded = await service.loadFromFile(DATA_FILE);
    if (!loaded) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'Loaded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
