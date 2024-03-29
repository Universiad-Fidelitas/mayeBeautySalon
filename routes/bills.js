const { Router } = require('express');
const { check, param } = require('express-validator');
const { getBills,
    postBill,
    putBill,
    deleteBill,
    getById } = require('../controllers/billsController');
const router = Router();

router.post('/', getBills)
router.post('/add', postBill)

router.get('/:bill_id', [ param('bill_id').isNumeric().withMessage('bill_id must be a number')], getById)
router.put('/:bill_id', [ param('bill_id').isNumeric().withMessage('bill_id must be a number')], router.put('/:bill_id', [ param('bill_id').isNumeric().withMessage('bill_id must be a number')], putBill)
)
router.post('/delete', [ param('bill_id').isNumeric().withMessage('bill_id must be a number')], deleteBill)

module.exports = router;