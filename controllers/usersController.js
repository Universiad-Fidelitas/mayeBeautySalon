const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');
const { hashPassword } = require('../helpers/bcrypt');

const getByIdUser = async (req, res = response) => {
    const { user_id } = req.params;
    try {
        const [userFound] = await dbService.query('SELECT * FROM users AND user_id = ?', [user_id]);
        res.json({userFound, status: true, message: 'Se ha encontrado el usuario exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'users', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}


const getUser = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM users';
        if (term) {
            baseQuery += ` WHERE id_card LIKE '%${term}%'`;
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
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('get', 'get error', 'services', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({ message: error.message });
    }
}

const postUser = async (req, res = response) => {
    const { role_id, id_card, first_name, last_name, email, phone, salary, id_card_type } = req.body;
    try {
        const userQuery = 'INSERT INTO users (role_id, id_card, first_name, last_name, email, phone, activated, image, salary, id_card_type ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
        const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, 1, req.file ? req.file.path : '', salary, id_card_type]);
        
        if (affectedRows > 0) {
            const userQuery = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
            const { affectedRows } = await dbService.query(userQuery, [insertId, await hashPassword('123456789') ]);
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
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('create', 'create error', 'usuarios', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar usuario!",
            error: message
        })
    }
}
const putUser = async (req, res = response) => {
    const { user_id } = req.params;
    const { role_id, id_card, first_name, last_name, email, activated, phone, salary, id_card_type } = req.body;
    if ('image' in req.body) {
        ({ image } = req.body);
    }
    console.log("1")
    try { 
        console.log("1.2")
        const userQuery = 'UPDATE users SET role_id = ?, id_card = ?, first_name = ?, last_name = ?, email = ?, phone = ?, activated = ?, image = ?, salary= ?, id_card_type = ? WHERE user_id = ?';
        const [userBeforeUpdate] = await dbService.query('SELECT first_name FROM users WHERE  user_id = ?', [user_id]);
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('update', ?, 'categories', NOW(), '', ?)`;
        await dbService.query(logQuery, ['actualizar usuarios | anterior: ' + userBeforeUpdate + ' | nuevo: ' + first_name, 11]);
        console.log("1.3")
        if ('image' in req.body) {
        const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, activated, image, salary, id_card_type, user_id ]);
        console.log("1.4")
        res.status(200).json({
            role_id: insertId,
            affectedRows:affectedRows,
            success: true,
            message: "¡El usuario ha sido editado exitosamente!"
        });
        }else{
            console.log("1.4.1")
            const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, activated, req.file ? req.file.path : '', salary, id_card_type, user_id]);
            res.status(200).json({
                role_id: insertId,
                affectedRows:affectedRows,
                success: true,
                message: "¡El usuario ha sido editado exitosamente!"
            });
        }

    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'usuarios', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la acción.!",
            error: error
        })
    }
}



const deleteUser = async (req, res = response) => {
    const { user_id } = req.body;
    try {
        //const rows = await dbService.query(`DELETE FROM rols WHERE rol_id IN (${rol_ids.join(',')})`);
        const [userBeforeUpdate] = await dbService.query('SELECT first_name FROM users WHERE  user_id = ?', [user_id]);
        const userNameBeforeUpdate = userBeforeUpdate ? userBeforeUpdate.first_name : "Desconocido";
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
        const logQuery = `
        INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
        VALUES ('delete', ?, 'categories', NOW(), '', ?)
    `;
    await dbService.query(logQuery, ['delete categories | old one: ' + userNameBeforeUpdate, 11]);
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'users', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

const getEmployments = async (req, res = response) => {
    try {
        const employments = await dbService.query('SELECT * FROM employments_summary', []);
    
        res.status(200).json({
            success: true,
            employments,
            message: "services.successAdd"
        });
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "services.errorAdd",
            error: error.message
        })
    }
}


module.exports = {
    getUser,
    postUser,
    deleteUser,
    putUser,
    getByIdUser,
    getEmployments
}