const { Router } = require('express');
const { check, param } = require('express-validator');
const { getLogs,
    postLog,
  
    } = require('../controllers/logsController'); 
const router = Router();

router.post('/', getLogs)
router.post('/add', postLog)



module.exports = router;
