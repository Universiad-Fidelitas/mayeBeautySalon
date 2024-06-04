const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { product_id } = req.params;
    try {
        const [product_found] = await dbService.query('SELECT * FROM `inventory_summary` WHERE activated = 1 AND product_id = ?', [product_id]);
        res.status(200).json({product_found, status: true, message: 'Se ha encontrado el producto exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Stock', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getStock = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy, category } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * FROM `inventory_summary`';

        if (term) {
            baseQuery += ` WHERE name LIKE '%${term}%' OR size LIKE '%${term}%' OR total_amount LIKE '%${term}%' OR price = '${term}'`;
        }
        if(category){
            if(category !== 'Elija una categoria'){
                const rows = await dbService.query(`SELECT * FROM categories WHERE name= ? LIMIT 1`, [category]);
                const data = helper.emptyOrRows(rows);
                if(term){
                    baseQuery += ` AND category_id = '${ data[0].category_id}'`;
                }else{
                    baseQuery += ` WHERE category_id = '${ data[0].category_id}'`;
                }
                
            }
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Stock', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getStock,
    getById
}