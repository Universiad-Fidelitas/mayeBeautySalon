const { Router } = require('express');
const { check } = require('express-validator');
const { userLogin } = require('../controllers/authController');
const router = Router();

router.post('/login', [
    check('email', 'Email is not valid').isEmail()
], userLogin)

module.exports = router;