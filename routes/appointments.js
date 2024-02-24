const { Router } = require('express');
const { getServiceStatus } = require('../controllers/appointmentsController');
const router = Router();

router.post('/service-status', getServiceStatus);

module.exports = router;