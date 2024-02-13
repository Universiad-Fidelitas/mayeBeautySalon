const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { generateToken } = require('../middlewares/jsonwebtoken');
const { comparePasswords } = require('../helpers/bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email/emailService");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { hashPassword } = require('../helpers/bcrypt');

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
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

        const rolQuery = "SELECT name FROM roles WHERE role_id = ?";
        const rolRows = await dbService.query(rolQuery, [usuario.role_id]);
        const rolName = helper.emptyOrRows(rolRows)[0];

        const userWithoutSensitiveData = { ...usuario };
        delete userWithoutSensitiveData.password;
        delete userWithoutSensitiveData.role_id;

        res.json({
            ...userWithoutSensitiveData,
            isLogin: true,
            role_name: rolName.name,
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
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        if (affectedRows > 0) {
            res.json({resetLink, status: true, message: 'Hemos enviado con éxito el enlace de restablecimiento a tu dirección de correo electrónico.' });
            await sendEmail('passwordRecoveryEmail', email, "Restablecimiento de contraseña", {
                resetLink,
                nombreUsuario: userFound.first_name
            });
        }
    } else {
        res.json({ status: false, message: 'Lo sentimos, no hemos encontrado el email del usuario. Por favor, verifica la información e intenta nuevamente.' });
    }
};

const resetPasswordTokenValidation = async (req, res) => {
    try {
        const { resetToken } = req.body;
        const [userToken] = await dbService.query('SELECT * FROM ps_tokens WHERE token = ?', [resetToken]);
        const { create_at, expired, user_id } = userToken;
        if (!expired) {
            const hoursDifference = moment(create_at).diff(moment(), 'hours');
            if (hoursDifference < 24) {
                res.json({ status: true, user_id, message: 'El token de validación es correcto. Proceso de verificación completado con éxito.' });
            } else {
                res.json({ status: false, message: 'El token de validación ha expirado. Por favor, inténtalo de nuevo.' });
            }
        } else {
            res.json({ status: false, message: 'El token de validación ha expirado. Por favor, inténtalo de nuevo.' });
        }
      } catch (error) {
        res.json({ status: false, message: 'El token de validación ha expirado. Por favor, inténtalo de nuevo.' });
    }
};


const updatingUserPassword = async (req, res) => {
    try {
        const { password, user_id, resetToken } = req.body;
        const [userToken] = await dbService.query('SELECT * FROM ps_tokens WHERE token = ?', [resetToken]);
        if (!userToken.expired) {
            const { affectedRows } = await dbService.query('UPDATE passwords SET password = ? WHERE user_id = ?', [await hashPassword(password), user_id]);
            const { affectedRows: affectedTokenRows } = await dbService.query('UPDATE ps_tokens SET expired = 1 WHERE token = ?; ', [resetToken]);
            if (affectedRows > 0 && affectedTokenRows > 0) {
                res.json({ status: true, message: 'Contraseña actualizada con éxito. Por favor, inicia sesión nuevamente. ¡Gracias!' });
            } else {
                res.json({ status: false, message: 'Se ha producido un error al intentar actualizar la contraseña. Por favor, inténtalo de nuevo.' });  
            }
        } else {
            res.json({ status: false, message: 'El token de validación ha expirado. Por favor, inténtalo de nuevo.' });
        }
      } catch (error) {
        res.json({ status: false, message: 'Se ha producido un error al intentar actualizar la contraseña. Por favor, inténtalo de nuevo.' });
    }
};


module.exports = {
    userLogin,
    tokenValidation,
    forgotPassword,
    resetPasswordTokenValidation,
    updatingUserPassword
}