const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { expense_id } = req.params;
    try {
        const [expenseFound] = await dbService.query('SELECT * FROM expenses WHERE expense_id = ?', [expense_id]);
        console.log(expenseFound)
        res.status(500).json({expenseFound, status: true, message: 'Se ha encontrado el gasto exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'expenses', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (error) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getExpenses = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select expense_id, expense_type, date, price from expenses where activated = 1';
        if (term) {
            baseQuery += ` AND expense_type LIKE '%${term}%'`;
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_expenses`);
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
                VALUES ('get', 'get error', 'expenses', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postExpense = async (req, res = response) => {
    const { expense_type, price } = req.body;
    try {
        const userQuery = `CALL sp_expense('create', '0', ?,?);`;
        const { insertId } = await dbService.query(userQuery, [expense_type, price]);

                res.status(200).json({
                    expense_id: insertId,
                    success: true,
                    message: "¡El gasto ha sido agregado exitosamente!"
                })
                const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', ?, 'exepnses', NOW(), '', ?)
            `;
            await dbService.query(logQuery, ['crete expense | new one: ' + expense_type, 11]);


    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'expenses', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar el gasto!",
            error: message
        })
    }
}


const putExpense = async (req, res = response) => {
    const { expense_id } = req.params;
    const { expense_type, price } = req.body;
    try {
        const [expenseBeforeUpdate] = await dbService.query('SELECT expense_type FROM categories WHERE activated = 1 AND category_id = ?', [expense_id]);
        const userQuery = `CALL sp_expense('update', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [expense_id, expense_type, price ]);
        res.status(200).json({
            expense_id: insertId,
            success: true,
            message: "¡El gasto ha sido editado exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'categories', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['update expenses | previus: ' + expenseBeforeUpdate + ' | new one: ' + expense_type, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'expenses', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar el gasto!",
            error: error
        })
    }
}

const deleteExpense = async (req, res = response) => {
    const { expense_id } = req.body;
    try {
        const userQuery = `CALL sp_expense('delete', ?, '','');`;
        const rows = await dbService.query(userQuery, [expense_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El gasto ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los gastos han sido eliminados exitosamente!"
            });
        }
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'expenses', NOW(), ?, ?)
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
    getExpenses,
    postExpense,
    putExpense,
    deleteExpense,
    getById
}