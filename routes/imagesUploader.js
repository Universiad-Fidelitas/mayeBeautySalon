const { Router } = require('express');
const { imagesUploader } = require("../controllers/imagesUploaderController");
const { upload, uploadMiddleware } = require('../helpers/imageUploader');
const router = Router();

router.post('/', upload.array('images'), uploadMiddleware, imagesUploader)

module.exports = router;