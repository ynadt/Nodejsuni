const router = require('express').Router();

router.use('/students', require('./students.routes'));
router.use('/backup', require('./backup.routes'));

module.exports = router;
