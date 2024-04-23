const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { role_id } = req.params;
    try {
        const [roleFound] = await dbService.query('SELECT * FROM roles WHERE activated = 1 AND role_id = ?', [role_id]);
        res.json({roleFound, status: true, message: 'Se ha encontrado el rol exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getRoles = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy, term2 } = req.body;
    try {
        const offset = pageIndex * pageSize;
        let activatedTerm2;
        if(term2===true){
            activatedTerm2=1
        }else{
            activatedTerm2=0
        }
        let baseQuery = `select role_id, name, permissions, activated from roles WHERE activated='${activatedTerm2}'`;
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const postRole = async (req, res = response) => {
    const { name, permissions } = req.body;
    try {
        const userQuery = `CALL sp_role('create', 0, ?, ?, 0);`;
        const { insertId } = await dbService.query(userQuery, [name, JSON.stringify(permissions) ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'create', 'Creación de rol']);
        res.status(200).json({
            role_id: insertId,
            success: true,
            message: "¡El rol ha sido agregado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar role!",
            error: message
        })
    }
}


const putRole = async (req, res = response) => {
    const { role_id } = req.params;
    const { name, permissions, activated } = req.body;
    try {
        const userQuery = `CALL sp_role('update', ?, ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [role_id, name, JSON.stringify(permissions), activated ]);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'update', 'Cambios en rol']);

        res.status(200).json({
            role_id: insertId,
            success: true,
            message: "¡El rol ha sido editado exitosamente!"
        })
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la acción.!",
            error: error
        })
    }
}

const deleteRole = async (req, res = response) => {
    const { role_id } = req.body;
    try {
        const userQuery = `CALL sp_role('delete', ?, '', '', 0);`;
        const rows = await dbService.query(userQuery, [role_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'delete', 'Inactivación de rol']);
        
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El rol ha sido desactivado/reactivado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los roles han sido desactivados/reactivados exitosamente!"
            });
        }
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Roles', req.header('CurrentUserId'), 'error', error.message]);
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