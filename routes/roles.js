const { Router } = require('express');
const { check, param } = require('express-validator');
const { getRoles,postRole,putRole, deleteRole, getById } = require('../controllers/rolesController');
const router = Router();

router.post('/', getRoles)
router.post('/add', postRole)

router.get('/:role_id', [ param('role_id').isNumeric().withMessage('role_id must be a number')], getById)
router.put('/:role_id', [ param('role_id').isNumeric().withMessage('role_id must be a number')], putRole)
router.post('/delete', [ param('role_id').isNumeric().withMessage('role_id must be a number')], deleteRole)

module.exports = router;