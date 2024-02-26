const { Router } = require('express');
const { getServiceStatus, getUserDataPrefill } = require('../controllers/appointmentsController');
const router = Router();

router.post('/service-status', getServiceStatus);
router.post('/user-prefill', getUserDataPrefill);

module.exports = router;