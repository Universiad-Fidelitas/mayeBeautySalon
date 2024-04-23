const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');



const getReport = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT name, image, total_amount, product_id, stock_status, Sold_amount FROM product_summary';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_reports`);
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}
const getReport2 = async (req, res = response) => {
    try{
        let baseQuery = 'SELECT `Ganancias`, `Conteo_Hoy`, `Conteo_Semana`, `Conteo_Mes`, `Conteo_Futuro` FROM `appointment_summary`';
        const query = `${baseQuery}`;
        const rows = await dbService.query(query);

        const response = {
            items: rows,
        };

        res.json(response);
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}
const getReport3 = async (req, res = response) => {
    try{
        let baseQuery = 'SELECT `profits_products`, `profits_services`, `salon_expenses`, `salaries`, `total_profits_this_month`, `total_profits_last_2_month`, `total_profits_last_3_month`, `total_profits_last_4_month`, `total_profits_last_5_month`, `total_profits_last_6_month` FROM `report_billing`';
        const query = `${baseQuery}`;
        const rows = await dbService.query(query);

        const response = {
            items: rows,
        };

        res.json(response);
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Servicios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getReport,
    getReport2,
    getReport3
}