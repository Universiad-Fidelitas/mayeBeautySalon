const { Router } = require('express');
const { getProviders, postProviders } = require('../controllers/providersController');
const router = Router();

router.get('/', getProviders)

router.post('/', postProviders)

module.exports = router;