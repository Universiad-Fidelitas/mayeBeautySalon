const { Router } = require('express');
const { check, param } = require('express-validator');
const { getRols, postRols, putRols, deleteRols, getById } = require('../controllers/rolsController');
const router = Router();

router.post('/', getRols)
router.post('/add', [
    check('name', 'Email is not valid').isEmail()
], postRols)

router.get('/:rol_id', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], getById)
router.put('/:rol_id', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], putRols)
router.post('/delete', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], deleteRols)

module.exports = router;