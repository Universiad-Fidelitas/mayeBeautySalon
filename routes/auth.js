const { Router } = require('express');
const { check } = require('express-validator');
const { userLogin, tokenValidation, forgotPassword, resetPasswordTokenValidation } = require('../controllers/authController');
const router = Router();

router.post('/login', [
    check('email', 'Email is not valid').isEmail()
], userLogin)

router.post('/token-validation', tokenValidation)
router.post('/password-reset', forgotPassword)
router.post('/password-reset/token', resetPasswordTokenValidation)

module.exports = router;