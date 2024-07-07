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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Inventario', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getInventory = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * from inventory_view';
        if (term) {
            baseQuery += ` WHERE product_name LIKE '%${term}%' OR action LIKE '%${term}%' OR description LIKE '%${term}%' OR size LIKE '%${term}%' OR amount = '${term}' OR inventory_price = '${term}'`;
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Inventario', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postInventory = async (req, res = response) => {
    const { action, dataToInsert , description } = req.body;
    let insertIds = []; 
    try {
        const userQuery = `INSERT INTO inventory ( action, price, date, description) VALUES (?, ?, CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '-06:00'), ?);`;
        const { insertId: inventoryInsertId } = await dbService.query(userQuery, [action, 0 , description]);
        for (const data of dataToInsert) {
            const query = 'INSERT INTO `inventory_products` (amount, inventory_id, product_id) VALUES (?, ?, ?);';
            const { insertId } = await dbService.query(query, [data.amount, inventoryInsertId, data.product_id]);
            insertIds.push(insertId);
        }
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Inventario', req.header('CurrentUserId'), 'create', 'Creación de movimiento de inventario']);
        res.status(200).json({
            inventory_id: inventoryInsertId,
            product_ids: insertIds,
            success: true,
            message: "¡El movimiento de inventario ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Inventario', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar el movimiento de inventario!",
            error: message
        })
    }
}


module.exports = {
    getInventory,
    postInventory,
    getById
}


