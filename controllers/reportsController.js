const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');



const getReport = async (req, res = response) => {
    try{
        let baseQuery = 'SELECT name, image, total_amount, product_id, stock_status, Sold_amount FROM product_summary';
        const query = `${baseQuery}`;
        const rows = await dbService.query(query);

        const response = {
            items: rows,
        };

        res.json(response);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'reports', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}
const getReport2 = async (req, res = response) => {
    try{
        let baseQuery = 'SELECT `Ganancias`, `Conteo_Hoy`, `Conteo_Semana`, `Conteo_Mes`, `Conteo_Futuro` FROM `appointment_summary`';
        const query = `${baseQuery}`;
        const rows = await dbService.query(query);

        const response = {
            items: rows,
        };

        res.json(response);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'reports', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getReport,
    getReport2
}