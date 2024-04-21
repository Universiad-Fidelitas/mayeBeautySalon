const { Router } = require('express');
const { getLogs, getActionLogs, getErrorLogs } = require('../controllers/logsController'); 
const router = Router();

router.get('/', getActionLogs);
router.get('/errors', getErrorLogs);

module.exports = router;
