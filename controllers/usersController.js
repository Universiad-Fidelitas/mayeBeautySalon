const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { hashPassword } = require('../helpers/bcrypt');

const getByIdUser = async (req, res = response) => {
    const { user_id } = req.params;
    try {
        const [userFound] = await dbService.query('SELECT * FROM users WHERE activated = 1 AND user_id = ?', [user_id]);
        res.json({userFound, status: true, message: 'Se ha encontrado el usuario exitosamente.' });
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}


const getUser = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * from users where activated = 1';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_users`);
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


const postUser = async (req, res = response) => {
    const { role_id, cedula, first_name, last_name, email, phone, imagen, password } = req.body;
    try {
        const userQuery = 'INSERT INTO users (role_id, cedula, first_name, last_name, email, phone, activated, imagen ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, cedula, first_name, last_name, email, phone, 1, imagen ]);
 
        if (affectedRows > 0) {
            const userQuery = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
            const { affectedRows } = await dbService.query(userQuery, [insertId, await hashPassword(password) ]);
            if (affectedRows > 0) {
                res.status(200).json({
                    user_id: insertId,
                    success: true,
                    message: "¡El usuario ha sido agregado exitosamente!"
                })
            }
        }
    }
    catch({ message }) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar usuario!",
            error: message
        })
    }
}


const putUser = async (req, res = response) => {
    const { user_id } = req.params;
    const { name, permissions } = req.body;
   /* try {
        const userQuery = `CALL sp_user('update', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [user_id, name, permissions ]);
        res.status(200).json({
            role_id: insertId,
            success: true,
            message: "¡El usuario ha sido editado exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la acción.!",
            error: error
        })
    }*/
}


const deleteUser = async (req, res = response) => {
    const { user_id } = req.body;
    try {
        //const rows = await dbService.query(`DELETE FROM rols WHERE rol_id IN (${rol_ids.join(',')})`);
 
        const userQuery = `CALL sp_user('delete', ?, '', '', '', 0, 0, '', 0, @inserted_id);`;
        const rows = await dbService.query(userQuery, [user_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡El usuario ha sido inactivo exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Los usuarios se han inactivado exitosamente!"
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
    getUser,
    postUser,
    deleteUser,
    putUser,
    getByIdUser
}