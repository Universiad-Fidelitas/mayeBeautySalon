const { Router } = require('express');
const { check, param } = require('express-validator');
const { getReport, getReport2 } = require('../controllers/reportsController');
const router = Router();

router.get('/report1', getReport)
router.get('/report2', getReport2)

module.exports = router;