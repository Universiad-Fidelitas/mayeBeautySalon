const { Router } = require('express');
const { check, param } = require('express-validator');
const { getExpenses,
    postExpense,
    getExpenseType,
    putExpense,
    deleteExpense,
    getById } = require('../controllers/expensesController');
const router = Router();

router.post('/', getExpenses)
router.post('/add', postExpense)
router.get('/types', getExpenseType)

router.get('/:expense_id', [ param('expense_id').isNumeric().withMessage('expense_id must be a number')], getById)
router.put('/:expense_id', [ param('expense_id').isNumeric().withMessage('expense_id must be a number')], router.put('/:expense_id', [ param('expense_id').isNumeric().withMessage('expense_id must be a number')], putExpense)
)
router.post('/delete', [ param('expense_id').isNumeric().withMessage('expense_id must be a number')], deleteExpense)

module.exports = router;