const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { provider_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM providers WHERE provider_id=${ provider_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getProviders = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM providers';

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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_providers`);
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

const postProviders = async (req, res = response) => {
    const { name } = req.body;
    const { activated } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO providers (name, activated) VALUES ("${ name }", "${ activated }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            provider_id: insertId,
            success: true,
            message: "¡El proveedor ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un proveedor duplicado!"
        })
    }
}

const putProviders = async (req, res = response) => {
    const { provider_id } = req.params;
    const { name } = req.body;
    const { activated } = req.body;

    try {
        const rows = await dbService.query(`UPDATE providers SET name="${ name }", activated="${activated }" WHERE provider_id=${ provider_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El proveedor ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteProviders = async (req, res = response) => {
    const { Providers_ids } = req.body;
    try {
        const rows = await dbService.query(`DELETE FROM providers WHERE provider_id IN (${Providers_ids.join(',')})`);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El proveedor ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los proveedores han sido eliminados exitosamente!"
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
    getProviders,
    postProviders,
    putProviders,
    deleteProviders,
    getById
}