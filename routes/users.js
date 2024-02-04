const { Router } = require('express');
const { check, param } = require('express-validator');
const { getUser, postUser, putUser, deleteUser, getByIdUser } = require('../controllers/usersController');
const router = Router();

router.post('/', getUser)
router.post('/add', postUser)

router.get('/:users_id', [ param('user_id').isNumeric().withMessage('user_id must be a number')], getByIdUser)
router.put('/:users_id', [ param('user_id').isNumeric().withMessage('user_id must be a number')], putUser)
router.post('/delete', [ param('user_id').isNumeric().withMessage('user_id must be a number')], deleteUser)

module.exports = router;