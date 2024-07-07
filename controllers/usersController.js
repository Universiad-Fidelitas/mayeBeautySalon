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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}


const getUser = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT * FROM users';
        if (term) {
            baseQuery += ` WHERE id_card LIKE '%${term}%' OR first_name LIKE '%${term}%' OR last_name LIKE '%${term}%' OR phone LIKE '%${term}%' OR email LIKE '%${term}%'`;
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}
function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}
const postUser = async (req, res = response) => {
    const { role_id, id_card, first_name, last_name, email, phone, salary, id_card_type, activated } = req.body;
    try {
        const userQuery = 'INSERT INTO users (role_id, id_card, first_name, last_name, email, phone, activated, image, salary, id_card_type ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
        const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, 1, req.file ? req.file.path : '', salary, id_card_type]);
        
        if (affectedRows > 0) {
            const userQuery = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
            const randomPassword = generateRandomPassword(12);
            const { affectedRows } = await dbService.query(userQuery, [insertId, await hashPassword(randomPassword) ]);
            if (affectedRows > 0) {
                res.status(200).json({
                    user_id: insertId,
                    success: true,
                    message: "¡El usuario ha sido agregado exitosamente!"
                })
            }
        }
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'create', 'Creación de usuario']);
    }
    catch({ message }) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
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
    try { 
        const userQuery = 'UPDATE users SET role_id = ?, id_card = ?, first_name = ?, last_name = ?, email = ?, phone = ?, activated = ?, image = ?, salary= ?, id_card_type = ? WHERE user_id = ?';
        if ('image' in req.body) {
        const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, activated, image, salary, id_card_type, user_id ]);
        res.status(200).json({
            role_id: insertId,
            affectedRows:affectedRows,
            success: true,
            message: "¡El usuario ha sido editado exitosamente!"
        });
        }else{
            const { affectedRows, insertId } = await dbService.query(userQuery, [role_id, id_card, first_name, last_name, email, phone, activated, req.file ? req.file.path : '', salary, id_card_type, user_id]);
            res.status(200).json({
                role_id: insertId,
                affectedRows:affectedRows,
                success: true,
                message: "¡El usuario ha sido editado exitosamente!"
            });
        }
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'update', 'Cambios en usuario']);
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'delete', 'Inactivación de usuario']);
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Usuarios', req.header('CurrentUserId'), 'error', error.message]);
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