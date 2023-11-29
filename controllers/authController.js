const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { generateToken } = require('../middlewares/jsonwebtoken');
const { comparePasswords } = require('../helpers/bcrypt');
const jwt = require('jsonwebtoken');

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


module.exports = {
    userLogin,
    tokenValidation
}