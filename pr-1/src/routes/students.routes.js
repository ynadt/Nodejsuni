const router = require('express').Router();
const ctrl = require('../controllers/students.controller');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/average-age', ctrl.getAverageAge);
router.get('/group/:id', ctrl.getByGroup);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
router.post('/save', ctrl.saveToFile);
router.post('/load', ctrl.loadFromFile);

module.exports = router;
