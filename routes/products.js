const { Router } = require('express');
const { getProducts, postProducts } = require('../controllers/productsController');
const router = Router();

router.get('/', getProducts)

router.post('/', postProducts)

module.exports = router;