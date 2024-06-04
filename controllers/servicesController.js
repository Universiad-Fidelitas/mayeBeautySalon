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
        res.status(500).json({message: error.message})
    }
}

const getServices = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy, term2 } = req.body;
    try {
        const offset = pageIndex * pageSize;
        let activatedTerm2;
        if(term2===true){
            activatedTerm2=1
        }else{
            activatedTerm2=0
        }
        let baseQuery = `SELECT * FROM services WHERE activated='${activatedTerm2}'`;
        if (term) {
            baseQuery += ` AND name LIKE '%${term}%' OR duration LIKE '%${term}%' OR price LIKE '%${term}%'`;
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
        res.status(500).json({ message: error.message });
    }
}

const postServices = async (req, res = response) => {
    try {
        const { name, duration, price } = req.body;
        const { insertId } = await dbService.query(`INSERT INTO services (name, duration, price, activated) VALUES (?, ?, ?, 1)`, [name, duration, price]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'create', 'Creación de servicio']);
        res.status(200).json({
            success: true,
            insertId,
            message: "services.successAdd"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
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
        const { name, duration, price, activated} = req.body;
        const  { changedRows }  = await dbService.query('UPDATE services SET name = ?, duration = ?, price = ?, activated = ? WHERE service_id = ?', [name, duration, price, activated, service_id]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'update', 'Cambios en servicio']);

        res.status(200).json({
            success: true,
            changedRows,
            message: "services.successEdit"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "services.errorEdit",
            error: error.message
        })
    }
}

const deleteServices = async (req, res = response) => {
    try {
        const { service_ids } = req.body;
        const placeholders = service_ids.map(() => '?').join(',');
        const query = `UPDATE services SET activated = NOT activated WHERE service_id IN (${placeholders});`;
        const { affectedRows } = await dbService.query(query, service_ids);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'delete', 'Inactivación de servicio']);

        res.status(200).json({
            success: true,
            affectedRows,
            message: "services.successDelete",
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
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