const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { provider_id } = req.params;
    try {
        const [providerFound] = await dbService.query('SELECT * FROM providers WHERE activated = 1 AND provider_id = ?', [provider_id]);
        res.status(500).json({providerFound, status: true, message: 'Se ha encontrado el proveedor exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'provedores', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getProviders = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select provider_id, name, phone, email from providers where activated = 1';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_providers`);
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
                VALUES ('get', 'get error', 'provedores', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postProvider = async (req, res = response) => {
    const { name, phone,email } = req.body;
    try {
        const userQuery = `CALL sp_provider('create', '0', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [name, phone,email]);

                res.status(200).json({
                    provider_id: insertId,
                    success: true,
                    message: "¡El proveedor ha sido agregado exitosamente!"
                })
                const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', ?, 'categories', NOW(), '', ?)
            `;
            await dbService.query(logQuery, ['crear proveedor | nuevo: ' + name, 11]);
    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('insert', 'insert error', 'proveedores', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar el proveedor!",
            error: message
        })
    }
}


const putProvider = async (req, res = response) => {
    const { provider_id } = req.params;
    const { name, phone, email } = req.body;
    try {

        const [providerBeforeUpdate] = await dbService.query('SELECT name FROM providers WHERE provider_id = ?', [provider_id]);
        const providerNameBeforeUpdate = providerBeforeUpdate ? providerBeforeUpdate.name : "Desconocido";
   

        const userQuery = `CALL sp_provider('update', ?, ?,?,?);`;
        const { insertId } = await dbService.query(userQuery, [provider_id, name, phone, email ]);

        res.status(200).json({
            provider_id: insertId,
            success: true,
            message: "¡El proveedor ha sido editado exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'categories', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['actualizar proveedores | anterior: ' + providerNameBeforeUpdate + ' | nuevo: ' + name, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'providers', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar el proveedor!",
            error: error
        })
    }
}

const deleteProvider = async (req, res = response) => {
    const { provider_id } = req.body;
    try {
        const [providerBeforeUpdate] = await dbService.query('SELECT name FROM providers WHERE provider_id = ?', [provider_id]);
        const providerNameBeforeUpdate = providerBeforeUpdate ? providerBeforeUpdate.name : "Desconocido";
        const userQuery = `CALL sp_provider('delete', ?, '', '', '');`;
        const rows = await dbService.query(userQuery, [provider_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El proveedor ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los proveedores han sido eliminados exitosamente!"
            });
        }
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('eliminar', ?, 'proveedores', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['eliminar proveedores | anterior: ' + providerNameBeforeUpdate, 11]);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'proveedores', NOW(), ?, ?)
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
    getProviders,
    postProvider,
    putProvider,
    deleteProvider,
    getById
}