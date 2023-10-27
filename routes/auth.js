const { Router } = require('express');
const { check } = require('express-validator');
const { userLogin, tokenValidation } = require('../controllers/authController');
const router = Router();

router.post('/login', [
    check('email', 'Email is not valid').isEmail()
], userLogin)

router.post('/token-validation', tokenValidation)

module.exports = router;