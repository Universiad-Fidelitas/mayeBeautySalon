const { Router } = require('express');
const { getCategories, postCategories } = require('../controllers/categoriesController');
const router = Router();

router.get('/', getCategories)

router.post('/', postCategories)

module.exports = router;