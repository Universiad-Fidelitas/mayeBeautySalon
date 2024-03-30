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

router.get('/:bills_id', [ param('bills_id').isNumeric().withMessage('bills_id must be a number')], getById)
router.put('/:bills_id', [ param('bills_id').isNumeric().withMessage('bills_id must be a number')], router.put('/:bills_id', [ param('bills_id').isNumeric().withMessage('bills_id must be a number')], putBill)
)
router.post('/delete', [ param('bills_id').isNumeric().withMessage('bills_id must be a number')], deleteBill)

module.exports = router;