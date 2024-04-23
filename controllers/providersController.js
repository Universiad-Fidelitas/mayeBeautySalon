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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getProviders = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select provider_id, name, phone, email, activated from providers WHERE activated = 1';
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postProvider = async (req, res = response) => {
    const { name, phone,email } = req.body;
    try {
        const userQuery = `CALL sp_provider('create', '0', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [name, phone,email]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'create', 'Creación de servicio']);

        res.status(200).json({
            provider_id: insertId,
            success: true,
            message: "¡El proveedor ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'error', error.message]);
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
        const userQuery = `CALL sp_provider('update', ?, ?,?,?);`;
        const { insertId } = await dbService.query(userQuery, [provider_id, name, phone, email ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'update', 'Cambios en proveedor']);

        res.status(200).json({
            provider_id: insertId,
            success: true,
            message: "¡El proveedor ha sido editado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'error', error.message]);
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
        const userQuery = `CALL sp_provider('delete', ?, '', '', '');`;
        const rows = await dbService.query(userQuery, [provider_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'delete', 'Inactivación de proveedor']);

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
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Provedores', req.header('CurrentUserId'), 'error', error.message]);
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