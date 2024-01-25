const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { generateToken } = require('../middlewares/jsonwebtoken');
const { comparePasswords } = require('../helpers/bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email/emailService");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = "SELECT * FROM auth_login WHERE email = ?";
        const rows = await dbService.query(query, [email]);
        const data = helper.emptyOrRows(rows);

        if (data.length === 0) {
            return res.status(200).json({
                isLogin: false,
                message: "Usuario o contraseña incorrectos"
            });
        }
        const usuario = data[0];

        if (!(await comparePasswords(password, usuario.password))) {
            return res.status(200).json({
                isLogin: false,
                message: "Usuario o contraseña incorrectos"
            });
        }

        const rolQuery = "SELECT name FROM rols WHERE rol_id = ?";
        const rolRows = await dbService.query(rolQuery, [usuario.rol_id]);
        const rolName = helper.emptyOrRows(rolRows)[0];

        const userWithoutSensitiveData = { ...usuario };
        delete userWithoutSensitiveData.password;
        delete userWithoutSensitiveData.rol_id;

        res.json({
            ...userWithoutSensitiveData,
            isLogin: true,
            rolName: rolName.name,
            token: generateToken(userWithoutSensitiveData),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const tokenValidation = async (req, res) => {
    const { token } = req.body;
    const secretKey = 'your-secret-key'; // Replace with your secret key
    if (token){
        try {
            jwt.verify(token, secretKey);
            res.json({ valid:  true});
          } catch (error) {
            res.json({ valid:  false});
        }
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const [userFound] = await dbService.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userFound) {
        const {user_id} = userFound;
        const resetToken = uuidv4();
        const { affectedRows } = await dbService.query('INSERT INTO ps_tokens (user_id, token, expired) VALUES (?, ?, ?)', [user_id, resetToken, 0]);
        const resetLink = `http://localhost:3000/reset-password/${user_id}/${resetToken}`;
        if (affectedRows > 0) {
            // await sendEmail('mgranadosmunoz@gmail.com', "Password reset", resetLink);
            res.json({ status: 'ok', message: 'Reset link sent successfully', resetLink });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const resetPasswordTokenValidation = async (req, res) => {
    try {
        const { user_id, resetToken } = req.body;
        const [userToken] = await dbService.query('SELECT * FROM ps_tokens WHERE user_id = ? AND token = ?', [user_id, resetToken]);
        const { create_at } = userToken;
        const hoursDifference = moment(create_at).diff(moment(), 'hours');
        if (hoursDifference < 2) {
            res.json({ status: 'ok', allowed: true,  message: 'Token is valid'});
        } else {
            res.json({ status: 'ok', allowed: false, message: 'Token is not valid or is expired' });
        }
      } catch (error) {
        res.status(500).json({ status: 'ok', allowed: false, message: error.message });
    }
};


module.exports = {
    userLogin,
    tokenValidation,
    forgotPassword,
    resetPasswordTokenValidation
}