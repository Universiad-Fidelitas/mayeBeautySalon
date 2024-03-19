const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { service_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM services WHERE service_id=${ service_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getServices = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM services where activated=1';
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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_services`);
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
                VALUES ('get', 'get error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postServices = async (req, res = response) => {
    try {
        const { name, duration, price } = req.body;
        const { insertId } = await dbService.query(`INSERT INTO services (name, duration, price, activated) VALUES (?, ?, ?, 1)`, [name, duration, price]);
        res.status(200).json({
            success: true,
            insertId,
            message: "services.successAdd"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('create', ?, 'categories', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['crete services | new one: ' + name, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('insert', 'insert error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "services.errorAdd",
            error: error.message
        })
    }
}

const putServices = async (req, res = response) => {
    try {
        const { service_id } = req.params;
        const { name, duration, price} = req.body;
        const [serviceBeforeUpdate] = await dbService.query('SELECT name FROM services WHERE service_id = ?', [service_id]);
        const serviceNameBeforeUpdate = serviceBeforeUpdate ? serviceBeforeUpdate.name : "Desconocido";
        const  { changedRows }  = await dbService.query('UPDATE services SET name = ?, duration = ?, price = ?, activated = 1 WHERE service_id = ?', [name, duration, price, service_id]);
        
        res.status(200).json({
            success: true,
            changedRows,
            message: "services.successEdit"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'categories', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['update services | previus: ' + serviceNameBeforeUpdate + ' | new one: ' + name, 11]);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('put', 'put error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "services.errorEdit",
            error: error.message
        })
    }
}

const deleteServices = async (req, res = response) => {

    try {
        const { service_id } = req.body;
        const { affectedRows } = await dbService.query(`UPDATE services SET activated=0 WHERE FIND_IN_SET(service_id, ?);`,[service_id]);
        console.log(dbService.query(`UPDATE services SET activated=0 WHERE FIND_IN_SET(service_id, ?);`,[service_id]))
        res.status(200).json({
            success: true,
            affectedRows,
            message: "services.successDelete",
        })
     
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "services.errorDelete",
            error: error.message
        })
    }
};

const getAllServices = async (req, res = response) => {
    try {
        const services = await dbService.query('SELECT * FROM services WHERE activated = 1');
        res.status(200).json({
            success: true,
            services,
            message: "services.successAdd"
        })
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getall', 'getall error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "services.errorAdd",
            error: error.message
        })
    }
}

module.exports = {
    getServices,
    postServices,
    putServices,
    deleteServices,
    getById,
    getAllServices
}