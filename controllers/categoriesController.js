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
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'categorias', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getCategories = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select category_id, name from categories where activated = 1';
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
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'categories', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postCategory = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_category('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name ]);

                res.status(200).json({
                    category_id: insertId,
                    success: true,
                    message: "¡La categoría ha sido agregada exitosamente!"
                })
                const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('crear', ?, 'categorias', NOW(), '', ?)
            `;
            await dbService.query(logQuery, ['crear categoria | nueva: ' + name, 11]);

    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('insert', 'insert error', 'categorias', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
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
        const [categorieBeforeUpdate] = await dbService.query('SELECT name FROM categories WHERE  category_id = ?', [category_id]);
        const categorieNameBeforeUpdate = categorieBeforeUpdate ? categorieBeforeUpdate.name : "Desconocido";
        const userQuery = `CALL sp_category('update', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [category_id, name ]);
        res.status(200).json({
            category_id: insertId,
            success: true,
            message: "¡La categoría ha sido editada exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('actualizar', ?, 'categorias', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['actualizar categorias | anterior: ' + categorieNameBeforeUpdate + ' | nueva: ' + name, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'categorias', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
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
        const [categorieBeforeUpdate] = await dbService.query('SELECT name FROM categories WHERE activated = 1 AND category_id = ?', [category_id]);
        const categorieNameBeforeUpdate = categorieBeforeUpdate ? categorieBeforeUpdate.name : "Desconocido";
        const userQuery = `CALL sp_category('delete', ?, '');`;
        const rows = await dbService.query(userQuery, [category_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
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
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('eliminar', ?, 'categorias', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['eliminar categorias | anterior: ' + categorieNameBeforeUpdate, 11]);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'categorias', NOW(), ?, ?)
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
    getCategories,
    postCategory,
    putCategory,
    deleteCategory,
    getById
}