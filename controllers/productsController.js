const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { product_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM products WHERE product_id=${ product_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getProducts = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM products';

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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_products`);
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

const postProducts = async (req, res = response) => {
    const { name } = req.body;
    const { brand } = req.body;
    const { price } = req.body;
    const { image } = req.body;
    const { activated } = req.body;
    const { provider_id } = req.body;
    const { category_id } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO products (name, brand, price, image, activated, provider_id, category_id) VALUES ("${ name }", "${ brand }", "${ price }", "${ image }", "${ activated }", "${ provider_id }", "${ category_id }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            product_id: insertId,
            success: true,
            message: "¡El producto ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un producto duplicado!"
        })
    }
}

const putProducts = async (req, res = response) => {
    const { product_id } = req.params;
    const { name } = req.body;
    const { brand } = req.body;
    const { price } = req.body;
    const { image } = req.body;
    const { activated } = req.body;
    const { provider_id } = req.body;
    const { category_id } = req.body;

    try {
        const rows = await dbService.query(`UPDATE products SET name="${ name }", brand="${ brand }", price="${price },"image="${ image }", activated="${activated }", provider_id="${provider_id }", category_id="${category_id }" WHERE product_id=${ product_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El producto ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteProducts = async (req, res = response) => {
    const { Products_ids } = req.body;
    try {
        const rows = await dbService.query(`DELETE FROM products WHERE product_id IN (${Products_ids.join(',')})`);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El producto ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los productos han sido eliminados exitosamente!"
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
    getProducts,
    postProducts,
    putProducts,
    deleteProducts,
    getById
}