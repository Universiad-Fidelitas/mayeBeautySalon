const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { inventory_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM inventory WHERE inventory_id=${ inventory_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getInventory = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM inventory';

        if (term) {
            baseQuery += ` WHERE action LIKE '%${term}%'`;
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
    const { action } = req.body;
    const { size } = req.body;
    const { amount } = req.body;
    const { product_id } = req.body;
    const { price } = req.body;
    const { date } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO inventory (action, size, amount, product_id, price, date) VALUES ("${ action }", "${ size }", "${ amount }", "${ product_id }", "${ price }", "${ date }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            product_id: insertId,
            success: true,
            message: "¡El movimiento ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un movimiento duplicado!"
        })
    }
}

const putInventory = async (req, res = response) => {
    const { inventory_id } = req.params;
    const { action } = req.body;
    const { size } = req.body;
    const { amount } = req.body;
    const { product_id } = req.body;
    const { price } = req.body;
    const { date } = req.body;

    try {
        const rows = await dbService.query(`UPDATE products SET action="${ action }", size="${ size }", amount="${amount },"product_id="${ product_id }", price="${price }", date="${date }" WHERE inventory_id=${ inventory_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El movimiento ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteInventory = async (req, res = response) => {
    const { Inventory_ids } = req.body;
    try {
        const rows = await dbService.query(`DELETE FROM inventory WHERE inventory_id IN (${Inventory_ids.join(',')})`);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El movimiento ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los movimiento han sido eliminados exitosamente!"
            });
        }
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

module.exports = {
    getInventory,
    postInventory,
    putInventory,
    deleteInventory,
    getById
}