const { Router } = require('express');
const { getServiceStatus, getUserDataPrefill, saveAppointment } = require('../controllers/appointmentsController');
const router = Router();

router.post('/service-status', getServiceStatus);
router.post('/user-prefill', getUserDataPrefill);
router.post('/save-appointment', saveAppointment);

module.exports = router;