const { Router } = require('express');
const { check, param } = require('express-validator');
const { getInventory,postInventory,putInventory, getById } = require('../controllers/inventoryController');
const router = Router();

router.post('/', getInventory)
router.post('/add', postInventory)

router.get('/:inventory_id', [ param('inventory_id').isNumeric().withMessage('inventory_id must be a number')], getById)

module.exports = router;