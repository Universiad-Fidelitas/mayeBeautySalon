const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { bill_id } = req.params;
    try {
        const [billFound] = await dbService.query('SELECT * FROM bill_view WHERE activated = 1 AND bills_id = ?', [bill_id]);
        res.status(500).json({billFound, status: true, message: 'Se ha encontrado la factura exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (error) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getBills = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * from bill_view where activated = 1';
        if (term) {
            baseQuery += ` AND user_fullname LIKE '%${term}%'`;
        }
        const orderByClauses = [];

        if (Array.isArray(sortBy)) {
            for (const sortItem of sortBy) {
                const { id, desc } = sortItem;
                if (id) {
                    orderByClauses.push(`${id} ${desc ? 'DESC' : 'ASC'}`);
                }
            }
        }

        if (orderByClauses.length > 0) {
            baseQuery += ` ORDER BY ${orderByClauses.join(', ')}`;
        }
        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await dbService.query(query);
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_bills`);
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
                VALUES ('get', 'get error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postBill = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_bill('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name]);

                res.status(200).json({
                    bill_id: insertId,
                    success: true,
                    message: "¡La factura ha sido agregada exitosamente!"
                })
                const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', ?, 'bills', NOW(), '', ?)
            `;
            await dbService.query(logQuery, ['crete bill | new one: ' + name, 11]);
    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la factura!",
            error: message
        })
    }
}


const putBill = async (req, res = response) => {
    const { bill_id } = req.params;
    const { name } = req.body;
    try {
       const [billBeforeUpdate] = await dbService.query('SELECT name FROM bills WHERE activated = 1 AND bill_id = ?', [bill_id]);
        const billNameBeforeUpdate = billBeforeUpdate ? billBeforeUpdate.name : "Desconocido"; 
        const userQuery = `CALL sp_bill('update', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [bill_id, name ]);
     
        res.status(200).json({
            bill_id: insertId,
            success: true,
            message: "¡La factura ha sido editada exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'bills', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['update bill | previus: ' + billNameBeforeUpdate + ' | new one: ' + name, 11]);
    
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la factura!",
            error: error
        })
    }
}

const deleteBill = async (req, res = response) => {
    const { bill_id } = req.body;
    try {

        const userQuery = `UPDATE bills SET activated=0 WHERE FIND_IN_SET(bills_id, ?)`;
        const rows = await dbService.query(userQuery, [bill_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La factura ha sido eliminado exitosamente!"
            });
          
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las facturas han sido eliminados exitosamente!"
            });
        }

        
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

module.exports = {
    getBills,
    postBill,
    putBill,
    deleteBill,
    getById
}