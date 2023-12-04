const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { category_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM categories WHERE category_id=${ category_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getCategories = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM categories';

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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_categories`);
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

const postCategories = async (req, res = response) => {
    const { name } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO categories (name) VALUES ("${ name }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            category_id: insertId,
            success: true,
            message: "¡El category ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un category duplicado!"
        })
    }
}

const putCategories = async (req, res = response) => {
    const { category_id } = req.params;
    const { name } = req.body;
    try {
        const rows = await dbService.query(`UPDATE categories SET name="${ name }" WHERE category_id=${ category_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El category ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteCategories = async (req, res = response) => {
    const { category_ids } = req.body;
    try {
        const rows = await dbService.query(`DELETE FROM categories WHERE category_id IN (${category_ids.join(',')})`);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El category ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los categories han sido eliminados exitosamente!"
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
    getCategories,
    postCategories,
    putCategories,
    deleteCategories,
    getById
}