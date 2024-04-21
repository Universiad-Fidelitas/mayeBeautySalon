const { response } = require('express');
const dbService = require('../database/dbService');

const getActionLogs = async (req, res = response) => {
    try {
        res.json(await dbService.query('SELECT * FROM `logs_summary` WHERE log_type != "error" ORDER BY date DESC LIMIT 100'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getErrorLogs = async (req, res = response) => {
    try {
        res.json(await dbService.query('SELECT * FROM `logs_summary` WHERE log_type = "error" ORDER BY date DESC LIMIT 100'));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActionLogs,
    getErrorLogs,
};
