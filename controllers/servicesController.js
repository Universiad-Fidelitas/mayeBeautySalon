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
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM services';
        if (term) {
            baseQuery += ` WHERE name LIKE '%${term}%'`;
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
        const { name, duration, price, activated } = req.body;
        const { insertId } = await dbService.query(`INSERT INTO services (name, duration, price, activated) VALUES (?, ?, ?, ?)`, [name, duration, price, activated]);
        res.status(200).json({
            success: true,
            insertId,
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

const putServices = async (req, res = response) => {
    try {
        const { service_id } = req.params;
        const { name, duration, price, activated} = req.body;
        const  { changedRows }  = await dbService.query('UPDATE services SET name = ?, duration = ?, price = ?, activated = ? WHERE service_id = ?', [name, duration, price, activated, service_id]);
        
        res.status(200).json({
            success: true,
            changedRows,
            message: "services.successEdit"
        })
    }
    catch(error) {
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
        const { affectedRows } = await dbService.query(`DELETE FROM services WHERE service_id IN (${placeholders})`, service_ids);
        
        res.status(200).json({
            success: true,
            affectedRows,
            message: "services.successDelete",
        })
    }
    catch(error) {
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