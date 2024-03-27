const { Router } = require('express');
const { check, param } = require('express-validator');
const { upload, uploadMiddleware } = require('../helpers/imageUploader');
const {     getProducts,
    postProducts,
    putProducts,
    deleteProducts,
    getById } = require('../controllers/productsController');
const router = Router();

router.post('/', getProducts)
router.post('/add', upload.single('image'), uploadMiddleware, postProducts)
router.get('/:product_id', [ param('product_id').isNumeric().withMessage('product_id must be a number')], getById)
router.put('/:product_id', [ param('product_id').isNumeric().withMessage('product_id must be a number')], router.put('/:product_id', [ param('product_id').isNumeric().withMessage('product_id must be a number')], upload.single('image'), uploadMiddleware, putProducts))
router.post('/delete', [ param('product_id').isNumeric().withMessage('product_id must be a number')], deleteProducts)

module.exports = router;