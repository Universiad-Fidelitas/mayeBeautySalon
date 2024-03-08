const { response } = require('express');
const dbService = require('../database/dbService');

const getLogs = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select log_id, action, activity, affected_table, date, error_message,  user_id from logs';
      

       
        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await dbService.query(query);
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_brands`);
        const totalRowCount = totalRowCountResult[0].count;

        const pageCount = Math.ceil(totalRowCount / pageSize);

        const response = {
            pageSize,
            pageIndex,
            pageCount,
            items: rows,
            rowCount: totalRowCount,
        };

        res.json(response);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postLog = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_logs('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name]);

                res.status(200).json({
                    brand_id: insertId,
                    success: true,
                    message: "¡El log ha sido agregada exitosamente!"
                })

    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la marca!",
            error: message
        })
    }
}

module.exports = {
    getLogs,
    postLog,
};
