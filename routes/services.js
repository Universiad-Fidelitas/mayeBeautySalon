const { Router } = require('express');
const { getServices, postServices } = require('../controllers/servicesController');
const router = Router();

router.get('/', getServices)

router.post('/', postServices)

module.exports = router;