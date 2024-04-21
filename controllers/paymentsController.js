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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}
const getPayments = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT `p`.`payment_id` AS `payment_id`, `b`.`bills_id` AS `bills_id`, `p`.`activated` AS `activated`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `p`.`payment_type` AS `payment_type`, `p`.`sinpe_phone_number` AS `sinpe_phone_number`, `p`.`status` AS `status`, `p`.`voucher_path` AS `voucher_path`, `i`.`date` AS `inventory_date`, `a`.`date` AS `appointment_date` FROM ( SELECT * FROM `mayebeautysalon`.`payments` GROUP BY `payment_id` ) AS `p` LEFT JOIN `mayebeautysalon`.`bills` `b` ON `b`.`payment_id` = `p`.`payment_id` LEFT JOIN `mayebeautysalon`.`users` `u` ON `b`.`user_id` = `u`.`user_id` LEFT JOIN `mayebeautysalon`.`inventory` `i` ON `b`.`inventory_id` = `i`.`inventory_id` LEFT JOIN `mayebeautysalon`.`appointments` `a` ON `b`.`appointment_id` = `a`.`appointment_id` WHERE p.activated=1 ';

        if (term) {
            baseQuery += ` AND payment_type LIKE '%${term}%'`;
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
            baseQuery += `GROUP BY p.payment_id ORDER BY ${orderByClauses.join(', ')}`;
        }

        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
        console.log(query);
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}
const postPayments = async (req, res = response) => {
    const { payment_type, sinpe_phone_number, status } = req.body;
    try {
        const userQuery= `call sp_payment ('create', '0', ?, ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [payment_type, sinpe_phone_number, req.file ? req.file.path : '', status]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'create', 'Creación de pago']);

        res.status(200).json({
            payment_id: insertId,
            success: true,
            message: "¡El pago ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un pago duplicado!",
            error: error
        })
    }
}
const putPayments= async (req, res = response) => {
    const { payment_id } = req.params;
    const { payment_type, sinpe_phone_number, status } = req.body;
    if ('voucher_path' in req.body) {
        ({ voucher_path } = req.body);
    }

    try {
        const userQuery = `CALL sp_payment('update', ?, ?, ?, ?, ?);`;
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'update', 'Cambios en pago']);
        if ('voucher_path' in req.body) {
            const { insertId } = await dbService.query(userQuery,[payment_id, payment_type, sinpe_phone_number, voucher_path, status]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El pago ha sido editado exitosamente!"
            });
        } else {
            const { insertId } = await dbService.query(userQuery, [ payment_id, payment_type, sinpe_phone_number, req.file ? req.file.path : '', status]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El pago ha sido editado exitosamente!"
            });
        }
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'error', error.message]);
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
            const userQuery = `CALL sp_payment('delete', ?, '', '', '', '');`;
            const rows = await dbService.query(userQuery, [payment_id]);
            const { affectedRows } = helper.emptyOrRows(rows);
            await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'delete', 'Inactivación de pago']);

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
        } catch (error) {
            await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Pagos', req.header('user_id'), 'error', error.message]);
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