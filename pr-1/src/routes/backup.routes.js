const router = require('express').Router();
const ctrl = require('../controllers/backup.controller');

router.post('/start', ctrl.start);
router.post('/stop', ctrl.stop);
router.get('/status', ctrl.status);
router.get('/report', ctrl.report);

module.exports = router;
