const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { rol_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM rols WHERE rol_id=${ rol_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getRols = async (req, res = response) => {
    const { pageIndex, NumOfItems, pagination } = req.body;
    try {
        const offSetStatus = pagination ? `LIMIT ${ pageIndex },${ NumOfItems }` : '';
        const rows = await dbService.query(`SELECT * FROM rols ${ offSetStatus }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const postRols = async (req, res = response) => {
    const { name } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO rols (name) VALUES ("${ name }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            insertId,
            msg: "Rol Added Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const putRols = async (req, res = response) => {
    const { rol_id } = req.params;
    const { name } = req.body;

    try {
        const rows = await dbService.query(`UPDATE rols SET name="${ name }" WHERE rol_id=${ rol_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            msg: "Rol Edited Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const deleteRols = async (req, res = response) => {
    const { rol_id } = req.params;
    try {
        const rows = await dbService.query(`DELETE FROM rols WHERE rol_id=${ rol_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            msg: "Rol Deleted Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getRols,
    postRols,
    putRols,
    deleteRols,
    getById
}