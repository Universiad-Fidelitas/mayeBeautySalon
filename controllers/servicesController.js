const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { service_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM services WHERE service_id=${ service_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getServices = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM services';

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

        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_services`);
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

const postServices = async (req, res = response) => {
    const { name } = req.body;
    const { duration } = req.body;
    const { price } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO services (name, time, price) VALUES ("${ name }", "${ duration }"), "${ price }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            service_id: insertId,
            success: true,
            message: "¡El servicio ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un servicio duplicado!"
        })
    }
}

const putServices = async (req, res = response) => {
    const { service_id } = req.params;
    const { name } = req.body;
    const { duration } = req.body;
    const { price } = req.body;

    try {
        const rows = await dbService.query(`UPDATE services SET name="${ name }", duration="${duration }", price="${price }" WHERE service_id=${ service_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El servicio ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteServices = async (req, res = response) => {
    const { Services_ids } = req.body;
    try {
        const rows = await dbService.query(`DELETE FROM services WHERE service_id IN (${Services_ids.join(',')})`);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El servicio ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los servicios han sido eliminados exitosamente!"
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
    getServices,
    postServices,
    putServices,
    deleteServices,
    getById
}