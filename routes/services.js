const { Router } = require('express');
const { getServices, postServices, putServices, deleteServices, getAllServices } = require('../controllers/servicesController');
const router = Router();

router.post('/', getServices)
router.get('/all', getAllServices)
router.post('/add', postServices)
router.put('/:service_id', putServices)
router.post('/delete', deleteServices)

module.exports = router;