const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

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
    const { nombre } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO rols (name) VALUES ("${ nombre }")`);
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
  