const { Router } = require('express');
const { getServiceStatus, getUserDataPrefill, saveAppointment, getAppointments, updateAppointment, addAppointment } = require('../controllers/appointmentsController');
const router = Router();

router.post('/update', updateAppointment);
router.post('/', getAppointments);
router.post('/service-status', getServiceStatus);
router.post('/user-prefill', getUserDataPrefill);
router.post('/save-appointment', saveAppointment);
router.post('/add-appointment', addAppointment);

module.exports = router;