const { Router } = require('express');
const { check, param } = require('express-validator');
const {
    getStock,
    getById } = require('../controllers/StockController');
const router = Router();

router.post('/', getStock)

router.get('/:product_id', [ param('product_id').isNumeric().withMessage('product_id must be a number')], getById)

module.exports = router;