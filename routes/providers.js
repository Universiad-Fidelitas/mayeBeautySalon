const { Router } = require('express');
const { check, param } = require('express-validator');
const { getProviders,
    postProvider,
    putProvider,
    deleteProvider,
    getById } = require('../controllers/providersController');
const router = Router();

router.post('/', getProviders)
router.post('/add', postProvider)

router.get('/:provider_id', [ param('provider_id').isNumeric().withMessage('provider_id must be a number')], getById)
router.put('/:provider_id', [ param('provider_id').isNumeric().withMessage('provider_id must be a number')], router.put('/:provider_id', [ param('provider_id').isNumeric().withMessage('provider_id must be a number')], putProvider)
)
router.post('/delete', [ param('provider_id').isNumeric().withMessage('provider_id must be a number')], deleteProvider)

module.exports = router;