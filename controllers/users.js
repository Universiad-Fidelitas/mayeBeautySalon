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
    const { rol_id, firstname, lastname, email, password } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO users (user_id, rol_id, firstname, lastname, email, password) VALUES (NULL, "${rol_id}", "${firstname}", "${lastname}", "${email}","${await hashPassword(password)}")`);
        const data = helper.emptyOrRows(rows);
        res.json(data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getUsers,
    postUser
}
  