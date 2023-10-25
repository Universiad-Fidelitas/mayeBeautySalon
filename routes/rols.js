const { Router } = require('express');
const { check, param } = require('express-validator');
const { getRols, postRols, putRols, deleteRols, getById } = require('../controllers/rolsController');
const router = Router();

router.get('/', getRols)
router.post('/', [
    check('name', 'Email is not valid').isEmail()
], postRols)

router.get('/:rol_id', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], getById)
router.put('/:rol_id', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], putRols)
router.delete('/:rol_id', [ param('rol_id').isNumeric().withMessage('rol_id must be a number')], deleteRols)

module.exports = router;