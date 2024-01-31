const { Router } = require('express');
const { userLogin, tokenValidation, forgotPassword, resetPasswordTokenValidation, updatingUserPassword } = require('../controllers/authController');
const router = Router();

router.post('/login', userLogin)
router.post('/token-validation', tokenValidation)
router.post('/password-reset', forgotPassword)
router.post('/password-reset/token', resetPasswordTokenValidation)
router.post('/password-reset/update-password', updatingUserPassword)

module.exports = router;