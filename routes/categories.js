const { Router } = require('express');
const { check, param } = require('express-validator');
const { getCategories,
    postCategory,
    putCategory,
    deleteCategory,
    getById } = require('../controllers/categoriesController');
const router = Router();

router.post('/', getCategories)
router.post('/add', postCategory)

router.get('/:category_id', [ param('category_id').isNumeric().withMessage('category_id must be a number')], getById)
router.put('/:category_id', [ param('category_id').isNumeric().withMessage('category_id must be a number')], router.put('/:category_id', [ param('category_id').isNumeric().withMessage('category_id must be a number')], putCategory)
)
router.post('/delete', [ param('category_id').isNumeric().withMessage('category_id must be a number')], deleteCategory)

module.exports = router;