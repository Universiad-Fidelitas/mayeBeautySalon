const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { role_id } = req.params;
    try {
        const rows = await dbService.query(`select name, permissions from roles where activated = 1 AND role_id=${ role_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getRoles = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select name, permissions from roles where activated = 1';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_rols`);
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

const postRole = async (req, res = response) => {
    const { name } = req.body;
    const { permissions } = req.body;
    try {
        //const rows = await dbService.query(`INSERT INTO rols (name) VALUES ("${ name }")`);
        const rows = await dbService.query(`CALL sp_role('create', 0, "${ name }", "${ permissions }");`);
        // const rows = await dbService.query(`INSERT INTO rols (name, permissions) VALUES ("${ name }"), ("${ permissions }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            role_id: insertId,
            success: true,
            message: "¡El rol ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar un rol duplicado!"
        })
    }
}

const putRole = async (req, res = response) => {
    const { role_id } = req.params;
    const { name } = req.body;
    const { permissions } = req.body;
    try {
        // const rows = await dbService.query(`UPDATE rols SET name="${ name }", permissions="${ permissions }" WHERE rol_id=${ rol_id }`);
        //const rows = await dbService.query(`UPDATE rols SET name="${ name }" WHERE rol_id=${ rol_id }`);
        const rows = await dbService.query(`CALL sp_role('update', ${ role_id }, '${ name }', '${permissions}');`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            success: true,
            message: "¡El rol ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
}

const deleteRole = async (req, res = response) => {
    const { role_id } = req.body;
    try {
        //const rows = await dbService.query(`DELETE FROM rols WHERE rol_id IN (${rol_ids.join(',')})`);
        const rows = await dbService.query(`CALL sp_role('delete', ${ role_id },'','')`);
        
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El rol ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los roles han sido eliminados exitosamente!"
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
    getRoles,
    postRole,
    putRole,
    deleteRole,
    getById
}