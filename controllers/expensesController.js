const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { expense_id } = req.params;
    try {
        const [expenseFound] = await dbService.query('SELECT * FROM expenses WHERE expense_id = ?', [expense_id]);
        res.status(500).json({expenseFound, status: true, message: 'Se ha encontrado el gasto exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}
const getExpenseType = async ( req,res = response) => {
    try {
        const query = `select distinct expense_type from expenses;`;
        const rows = await dbService.query(query);
        res.status(200).json({items: rows, status: true, message: 'Se ha encontrado el gasto exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getExpenses = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select expense_id, expense_type, date, price, activated from expenses WHERE activated = 1';
        if (term) {
            baseQuery += ` AND expense_type LIKE '%${term}%' OR price = '${term}'`;
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postExpense = async (req, res = response) => {
    const { expense_type, price } = req.body;
    try {
        const userQuery = `CALL sp_expense('create', '0', ?,?);`;
        const { insertId } = await dbService.query(userQuery, [expense_type, price]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'create', 'Creación de gasto']);

        res.status(200).json({
            expense_id: insertId,
            success: true,
            message: "¡El gasto ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
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
        const userQuery = `CALL sp_expense('update', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [expense_id, expense_type, price ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'update', 'Cambios en gasto']);

        res.status(200).json({
            expense_id: insertId,
            success: true,
            message: "¡El gasto ha sido editado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
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
        const userQuery = `CALL sp_expense('delete', ?, '',0);`;
        const rows = await dbService.query(userQuery, [expense_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'delete', 'Inactivación de gasto']);
        
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Gastos', req.header('CurrentUserId'), 'error', error.message]);
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
    getExpenseType,
    deleteExpense,
    getById
}