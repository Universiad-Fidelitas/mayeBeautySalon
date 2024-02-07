const { Router } = require('express');
const { check, param } = require('express-validator');
const { getBrands,
    postBrand,
    putBrand,
    deleteBrand,
    getById } = require('../controllers/brandsController');
const router = Router();

router.post('/', getBrands)
router.post('/add', postBrand)

router.get('/:brand_id', [ param('brand_id').isNumeric().withMessage('brand_id must be a number')], getById)
router.put('/:brand_id', [ param('brand_id').isNumeric().withMessage('brand_id must be a number')], router.put('/:brand_id', [ param('brand_id').isNumeric().withMessage('brand_id must be a number')], putBrand)
)
router.post('/delete', [ param('brand_id').isNumeric().withMessage('brand_id must be a number')], deleteBrand)

module.exports = router;