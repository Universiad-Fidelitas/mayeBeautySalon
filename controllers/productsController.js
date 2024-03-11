const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { product_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM product_info WHERE product_id=${ product_id } AND activated=1`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getOne', 'getOne error', 'products', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getProducts = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM product_info WHERE activated=1';

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
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'products', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postProducts = async (req, res = response) => {
    const { name, brand_id, price, size, provider_id, category_id } = req.body;
    try {
        
        const userQuery= `call sp_product ('create', '0', ?, ?, ?, ?, ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [name, brand_id, price, size, req.file.path, provider_id, category_id]);

        res.status(200).json({
            product_id: insertId,
            success: true,
            message: "¡El producto ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'products', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un producto duplicado!",
            error: error
        })
    }
}

const putProducts = async (req, res = response) => {
    const { product_id } = req.params;
    const { name, brand_id, price, size, provider_id, category_id } = req.body;
    if ('image' in req.body) {
        ({ image } = req.body);
    }
    try {
        const userQuery = `call sp_product ('update', ?, ?, ?, ?, ?, ?, ?, ?);`;
        if ('image' in req.body) {
            const { insertId } = await dbService.query(userQuery, [product_id, name, brand_id, price, size, image, provider_id, category_id]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El producto ha sido editado exitosamente!"
            });
        } else {
            const { insertId } = await dbService.query(userQuery, [product_id, name, brand_id, price, size, req.file.path, provider_id, category_id]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El producto ha sido editado exitosamente!"
            });
        }
    }
        catch(error) {
            try {
                const logQuery = `
                    INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                    VALUES ('update', 'update error', 'products', NOW(), ?, ?)
                `;
                await dbService.query(logQuery, [error.message, 1]);
            } catch (logError) {
                console.error('Error al insertar en la tabla de Logs:', logError);
            }
            res.status(200).json({
                success: false,
                message: "¡Se ha producido un error al editar el producto!",
                error: error
            })
        }
    }

    const deleteProducts = async (req, res = response) => {
        const { product_id } = req.body;
        try {
            const userQuery = `call sp_product ('delete', ?, '', 0, 0, '', '', 0, 0);`;
            const rows = await dbService.query(userQuery, [product_id]);
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
            try {
                const logQuery = `
                    INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                    VALUES ('delete', 'delete error', 'products', NOW(), ?, ?)
                `;
                await dbService.query(logQuery, [error.message, 1]);
            } catch (logError) {
                console.error('Error al insertar en la tabla de Logs:', logError);
            }
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