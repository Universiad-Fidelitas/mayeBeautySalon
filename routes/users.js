const { Router } = require('express');
const { param } = require('express-validator');
const { getUser, postUser, putUser, deleteUser, getByIdUser, getEmployments } = require('../controllers/usersController');
const { upload, uploadMiddleware } = require('../helpers/imageUploader');
const router = Router();

router.post('/', getUser)
router.post('/add', upload.single('image'), uploadMiddleware, postUser)
router.get('/:users_id', [ param('user_id').isNumeric().withMessage('user_id must be a number')], getByIdUser)
router.put('/:user_id', upload.single('image'), uploadMiddleware, putUser)
router.post('/delete', [ param('user_id').isNumeric().withMessage('user_id must be a number')], deleteUser)
router.post('/employments', getEmployments)

module.exports = router;