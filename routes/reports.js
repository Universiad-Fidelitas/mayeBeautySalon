const { Router } = require('express');
const { check, param } = require('express-validator');
const { getReport, getReport2, getReport3 } = require('../controllers/reportsController');
const router = Router();

router.post('/report1', getReport)
router.get('/report2', getReport2)
router.get('/report3', getReport3)

module.exports = router;