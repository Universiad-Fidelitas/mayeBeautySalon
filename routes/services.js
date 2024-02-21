const { Router } = require('express');
const { getServices, postServices, putServices, deleteServices } = require('../controllers/servicesController');
const router = Router();

router.post('/', getServices)
router.post('/add', postServices)
router.put('/:service_id', putServices)
router.post('/delete', deleteServices)

module.exports = router;