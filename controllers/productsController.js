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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getProducts = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy, term2 } = req.body;
    try {
        const offset = pageIndex * pageSize;
        let activatedTerm2;
        if(term2===true){
            activatedTerm2=1
        }else{
            activatedTerm2=0
        }
        let baseQuery = `SELECT * FROM product_info WHERE activated='${activatedTerm2}'`;
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postProducts = async (req, res = response) => {
    const { name, brand_id, price, size, provider_id, category_id, price_buy } = req.body;
    try {
        
        const userQuery= `call sp_product ('create', '0', ?, ?, ?, ?, ?, ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [name, brand_id, price, size, req.file.path, provider_id, category_id, price_buy]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'create', 'Creación de producto']);

        res.status(200).json({
            product_id: insertId,
            success: true,
            message: "¡El producto ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un producto duplicado!",
            error: error
        })
    }
}

const putProducts = async (req, res = response) => {
    const { product_id } = req.params;
    const { name, brand_id, price, size, provider_id, category_id, price_buy } = req.body;
    try {
        if ('image' in req.body) {
            ({ image } = req.body);
        }
        const userQuery = `call sp_product ('update', ?, ?, ?, ?, ?, ?, ?, ?,?);`;
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'update', 'Cambios en producto']);
        if ('image' in req.body) {
            const { insertId } = await dbService.query(userQuery, [product_id, name, brand_id, price, size, image, provider_id, category_id, price_buy]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El producto ha sido editado exitosamente!"
            });
        } else {
            const { insertId } = await dbService.query(userQuery, [product_id, name, brand_id, price, size, req.file.path, provider_id, category_id, price_buy]);
            res.status(200).json({
                category_id: insertId,
                success: true,
                message: "¡El producto ha sido editado exitosamente!"
            });
        }
    }
        catch(error) {
            await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'error', error.message]);
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
            const userQuery = `call sp_product ('delete', ?, '', 0, 0, '', '', 0, 0, 0);`;
            const rows = await dbService.query(userQuery, [product_id]);
            const { affectedRows } = helper.emptyOrRows(rows);
            await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'delete', 'Inactivación de producto']);
            
            if( affectedRows === 1 ) {
                res.status(200).json({
                    success: true,
                    message: "¡El producto ha sido desactivado/reactivado exitosamente!"
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "¡Los productos han sido desactivados/reactivados exitosamente!"
                });
            }
        } catch (error) {
            await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Productos', req.header('user_id'), 'error', error.message]);
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