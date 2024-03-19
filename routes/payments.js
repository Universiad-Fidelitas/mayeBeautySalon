const { Router } = require('express');
const { check, param } = require('express-validator');
const { upload, uploadMiddleware } = require('../helpers/imageUploader');
const {     getPayments,
    postPayments,
    putPayments,
    deletePayments,
    getById } = require('../controllers/paymentsController');
const router = Router();

router.post('/', getPayments)
router.post('/add', upload.single('image'), uploadMiddleware, postPayments)

router.get('/:payment_id', [ param('payment_id').isNumeric().withMessage('payment_id must be a number')], getById)
router.put('/:payment_id', [ param('payment_id').isNumeric().withMessage('payment_id must be a number')], router.put('/:payment_id', [ param('payment_id').isNumeric().withMessage('payment_id must be a number')], upload.single('image'), uploadMiddleware, putPayments))
router.post('/delete', [ param('payment_id').isNumeric().withMessage('payment_id must be a number')], deletePayments)

module.exports = router;