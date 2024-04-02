const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');


const getById = async (req, res = response) => {
    const { payment_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM payments WHERE payment_id=${ payment_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getOne', 'getOne error', 'pagos', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}
const getPayments = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM payments';

        if (term) {
            baseQuery += ` AND name LIKE '%${term}%'`;
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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_payments`);
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
                VALUES ('get', 'get error', 'pagos', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}
const postPayments = async (req, res = response) => {
    const { payment_type, sinpe_phone, status, voucher_path } = req.body;
    try {
        
        const userQuery= `call sp_payment ('create', '0', ?, ?, ?, ?, ?, ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [payment_type, sinpe_phone, status, voucher_path, req.file.path]);

        res.status(200).json({
            payment_id: insertId,
            success: true,
            message: "¡El pago ha sido agregado exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('create', ?, 'pagos', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['crear pago | nuevo: ' + payment_type, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'pagos', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un pago duplicado!",
            error: error
        })
    }
}
const putPayments= async (req, res = response) => {
    const { payment_id } = req.params;
    const { payment_type, sinpe_phone, status, voucher_path } = req.body;
    if ('image' in req.body) {
        ({ image } = req.body);
    }
    try {
        const [paymentBeforeUpdate] = await dbService.query('SELECT name FROM payments WHERE payment_id = ?', [payment_id]);
        const paymentNameBeforeUpdate = paymentBeforeUpdate ? paymentBeforeUpdate.payment_type : "Desconocido";
        const userQuery = `call sp_payment ('update', ?, ?, ?, ?, ?, ?, ?, ?,?);`;
        if ('image' in req.body) {
            const { insertId } = await dbService.query(userQuery, [payment_id,payment_type, sinpe_phone, status, voucher_path]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El pago ha sido editado exitosamente!"
            });
        } else {
            const { insertId } = await dbService.query(userQuery, [ payment_id,payment_type, sinpe_phone, status, voucher_path]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El pago ha sido editado exitosamente!"
            });
        }
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('actualizar', ?, 'pagos', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['actualizar pagos | anterior: ' + paymentNameBeforeUpdate + ' | nuevo: ' + payment_type, 11]);
    }
        catch(error) {
            try {
                const logQuery = `
                    INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                    VALUES ('update', 'update error', 'pagos', NOW(), ?, ?)
                `;
                await dbService.query(logQuery, [error.message, 11]);
            } catch (logError) {
                console.error('Error al insertar en la tabla de Logs:', logError);
            }
            res.status(200).json({
                success: false,
                message: "¡Se ha producido un error al editar el pago!",
                error: error
            })
        }
    }
    const deletePayments = async (req, res = response) => {
        const { payment_id } = req.body;
        try {
            const [paymentBeforeUpdate] = await dbService.query('SELECT payment_type FROM payments WHERE payment_id = ?', [payment_id]);
            const userQuery = `call sp_payment ('delete', ?, '', 0, 0, '', '', 0, 0, 0);`;
            const rows = await dbService.query(userQuery, [payment_id]);
            const { affectedRows } = helper.emptyOrRows(rows);
            if( affectedRows === 1 ) {
                res.status(200).json({
                    success: true,
                    message: "¡El pago ha sido eliminado exitosamente!"
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "¡Los pagos han sido eliminados exitosamente!"
                });
            }
            const logQuery = `
            INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
            VALUES ('eliminar', ?, 'pagos', NOW(), '', ?)
        `;
        await dbService.query(logQuery, ['eliminar pagos | anterior: ' + paymentBeforeUpdate, 11]);
        } catch (error) {
            try {
                const logQuery = `
                    INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                    VALUES ('delete', 'delete error', 'pagos', NOW(), ?, ?)
                `;
                await dbService.query(logQuery, [error.message, 11]);
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
        getPayments,
        postPayments,
        putPayments,
        deletePayments,
        getById
    }