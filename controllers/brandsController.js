const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { brand_id } = req.params;
    try {
        const [brandFound] = await dbService.query('SELECT * FROM brands WHERE activated = 1 AND brand_id = ?', [brand_id]);
        res.status(500).json({brandFound, status: true, message: 'Se ha encontrado la marca exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (error) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getBrands = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select brand_id, name from brands where activated = 1';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_brands`);
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
                VALUES ('get', 'get error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postBrand = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_brand('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name]);

                res.status(200).json({
                    brand_id: insertId,
                    success: true,
                    message: "¡La marca ha sido agregada exitosamente!"
                })
                const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', ?, 'brands', NOW(), '', ?)
            `;
            await dbService.query(logQuery, ['crete brand | new one: ' + name, 11]);
    }
    catch({ message }) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la marca!",
            error: message
        })
    }
}


const putBrand = async (req, res = response) => {
    const { brand_id } = req.params;
    const { name } = req.body;
    try {
       const [brandBeforeUpdate] = await dbService.query('SELECT name FROM brands WHERE activated = 1 AND brand_id = ?', [brand_id]);
        const brandNameBeforeUpdate = brandBeforeUpdate ? brandBeforeUpdate.name : "Desconocido"; 
        const userQuery = `CALL sp_brand('update', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [brand_id, name ]);
     
        res.status(200).json({
            brand_id: insertId,
            success: true,
            message: "¡La marca ha sido editada exitosamente!"
        })
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'brands', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['update brand | previus: ' + brandNameBeforeUpdate + ' | new one: ' + name, 11]);
    
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'brands', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la marca!",
            error: error
        })
    }
}

const deleteBrand = async (req, res = response) => {
    const { brand_id } = req.body;
    try {
        const [brandBeforeUpdate] = await dbService.query('SELECT name FROM brands WHERE activated = 1 AND brand_id = ?', [brand_id]);
        const brandNameBeforeUpdate = brandBeforeUpdate ? brandBeforeUpdate.name : "Desconocido"; 
        const userQuery = `CALL sp_brand('delete', ?, '');`;
        const rows = await dbService.query(userQuery, [brand_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La marca ha sido eliminado exitosamente!"
            });
          
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las marcas han sido eliminados exitosamente!"
            });
        }
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('delete', ?, 'brands', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['delete brand | old one: ' + brandNameBeforeUpdate, 11]);
        
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'brands', NOW(), ?, ?)
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
    getBrands,
    postBrand,
    putBrand,
    deleteBrand,
    getById
}