const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { category_id } = req.params;
    try {
        const [categoryFound] = await dbService.query('SELECT * FROM categories WHERE activated = 1 AND category_id = ?', [category_id]);
        res.status(500).json({categoryFound, status: true, message: 'Se ha encontrado la categoría exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getCategories = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select category_id, name, activated from categories WHERE activated = 1';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_categories`);
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postCategory = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_category('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'create', 'Creación de categoria']);

        res.status(200).json({
            category_id: insertId,
            success: true,
            message: "¡La categoría ha sido agregada exitosamente!"
        })
    }
    catch({ message }) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la categoría!",
            error: message
        })
    }
}


const putCategory = async (req, res = response) => {
    const { category_id } = req.params;
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_category('update', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [category_id, name ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'update', 'Cambios en categoria']);

        res.status(200).json({
            category_id: insertId,
            success: true,
            message: "¡La categoría ha sido editada exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la categoria!",
            error: error
        })
    }
}

const deleteCategory = async (req, res = response) => {
    const { category_id } = req.body;
    try {
        const userQuery = `CALL sp_category('delete', ?, '');`;
        const rows = await dbService.query(userQuery, [category_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'delete', 'Inactivación de categoria']);

        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La categoría ha sido eliminada exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las categorias han sido eliminadas exitosamente!"
            });
           
        }
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Categorias', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

module.exports = {
    getCategories,
    postCategory,
    putCategory,
    deleteCategory,
    getById
}