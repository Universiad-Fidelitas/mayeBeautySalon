const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { hashPassword } = require('../helpers/bcrypt');

const getUsers = async (req, res = response) => {
    try {
        const rows = await dbService.query('SELECT * FROM users LIMIT 0,10');
        const data = helper.emptyOrRows(rows);
        res.json(data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}


const postUser = async (req, res = response) => {
    const { rol_id, cedula, first_name, last_name, email, phone, activated, imagen, password } = req.body;
    try {
        const userQuery = 'INSERT INTO users (rol_id, cedula, first_name, last_name, email, phone, activated, imagen ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const { affectedRows, insertId } = await dbService.query(userQuery, [rol_id, cedula, first_name, last_name, email, phone, activated, imagen ]);

        if (affectedRows > 0) {
            const userQuery = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
            const { affectedRows } = await dbService.query(userQuery, [insertId, await hashPassword(password) ]);
            if (affectedRows > 0) {
                res.status(200).json({
                    user_id: insertId,
                    success: true,
                    message: "¡El usuario ha sido agregado exitosamente!"
                })
            }
        }
    }
    catch({ message }) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar usuario!",
            error: message
        })
    }
}

module.exports = {
    getUsers,
    postUser
}