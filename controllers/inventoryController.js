const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { product_id } = req.params;
    try {
        const [product_found] = await dbService.query('SELECT * FROM products WHERE activated = 1 AND product_id = ?', [product_id]);
        res.status(200).json({product_found, status: true, message: 'Se ha encontrado el producto exitosamente.' });
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getInventory = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select inventory_id, action, date, price from inventory';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_inventory`);
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

const postInventory = async (req, res = response) => {
    const { action, date, price } = req.body;
    try {
        const userQuery = `CALL SP_inventory('create','0', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [action, price, date]);

                res.status(200).json({
                    role_id: insertId,
                    success: true,
                    message: "¡El inventario ha sido agregado exitosamente!"
                })

    }
    catch({ message }) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar inventario!",
            error: message
        })
    }
}


module.exports = {
    getInventory,
    postInventory,
    getById
}