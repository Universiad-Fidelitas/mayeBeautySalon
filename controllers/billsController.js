const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { bill_id } = req.params;
    try {
        const [billFound] = await dbService.query('SELECT * FROM bill_view WHERE activated = 1 AND bills_id = ?', [bill_id]);
        res.status(500).json({billFound, status: true, message: 'Se ha encontrado la factura exitosamente.' });
    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('getone', 'getone error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 1]);
        } catch (error) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(500).json({message: error.message})
    }
}

const getBills = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * from bill_view where activated = 1';
        if (term) {
            baseQuery += ` AND first_name LIKE '%${term}%'`;
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
        for (const row of rows) {
            const inventoryId = row.inventory_id;
            const productQuery = `SELECT amount, product_id, invetory_products_id FROM inventory_products WHERE inventory_id = ${inventoryId}`;
            const productData = await dbService.query(productQuery);
            row.dataToInsert = productData;
        }
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_bills`);
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
const getUserBills = async (req, res = response) => {
    try {
        const { id_card } = req.body;
        ; 
        const queryActiveAppointments = 'SELECT id_card, first_name,last_name,email, phone FROM users WHERE id_card = ?';
        const userPrefillData = await dbService.query(queryActiveAppointments, [id_card]);
    
        res.status(200).json({
            success: true,
            userPrefillData,
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
const postBill = async (req, res = response) => {
    const {  status, payment_type, sinpe_phone_number, description, dataToInsert, id_card, first_name, last_name, email, phone } = req.body;
    try {
        const userQuery = `INSERT INTO payments(status, payment_type, sinpe_phone_number) VALUES (?, ?, ?);`;
        const { insertId: paymentInsertId } = await dbService.query(userQuery, [status, payment_type, sinpe_phone_number]);
        const userQuery2 = `INSERT INTO inventory ( action, price, date, description) VALUES ('remove', ?, CURRENT_TIMESTAMP, ?);`;
        const { insertId: inventoryInsertId } = await dbService.query(userQuery2, [ 0 , description]);
        for (const data of dataToInsert) {
            const query = 'INSERT INTO `inventory_products` (amount, inventory_id, product_id) VALUES (?, ?, ?);';
            const { insertId } = await dbService.query(query, [data.amount, inventoryInsertId, data.product_id]);
        }
        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";
        const userChecker = await dbService.query(queryUserChecker, [id_card]); 
        let userInsertId;
        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (role_id, id_card, first_name, last_name, email, phone, activated, image, salary) VALUES ( 1, ?, ?, ?, ?, ?, 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card, first_name, last_name, email, phone]);
            const queryAddBill =`INSERT INTO bills(user_id, inventory_id, payment_id, activated) VALUES (?, ?, ?, 1)`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId, inventoryInsertId, paymentInsertId]);
            res.status(200).json({
                bill_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        } else { 
            userInsertId  = userChecker[0].user_id
            const queryAddBill =`INSERT INTO bills(user_id, inventory_id, payment_id, activated) VALUES (?, ?, ?, 1)`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId, inventoryInsertId, paymentInsertId]);
            res.status(200).json({
                bill_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        }

    }
    catch({ message }) {

        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la factura!",
            error: message
        })
    }
}

const putBill = async (req, res = response) => {
    const { bill_id } = req.params;
    const { status, payment_type, sinpe_phone_number, description, dataToInsert, id_card, first_name, last_name, email, phone, payment_id, inventory_id } = req.body;
    try {
        const userQuery = `UPDATE payments SET status= ?, payment_type= ?, sinpe_phone_number= ? WHERE payment_id= ?`;
        const { insertId: paymentInsertId } = await dbService.query(userQuery, [status, payment_type, sinpe_phone_number, payment_id]);
        const userQuery2 = `UPDATE inventory SET description= ? WHERE inventory_id = ? ;`;
        const { insertId: inventoryInsertId } = await dbService.query(userQuery2, [ description, inventory_id]);
        for (const data of dataToInsert) {
            const query = 'UPDATE inventory_products SET amount = ?, product_id = ? WHERE invetory_products_id = ?;';
            const { insertId } = await dbService.query(query, [data.amount, data.product_id, data.invetory_products_id]);
        }
        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";
        const userChecker = await dbService.query(queryUserChecker, [id_card]); 
        let userInsertId;
        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (role_id, id_card, first_name, last_name, email, phone, activated, image, salary) VALUES ( 1, ?, ?, ?, ?, ?, 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card, first_name, last_name, email, phone]);
            const queryAddBill =`UPDATE bills SET user_id = ? WHERE bills_id = ?`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId,bill_id]);
            res.status(200).json({
                bill_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        } else { 
            userInsertId  = userChecker[0].user_id
            const queryAddBill =`UPDATE bills SET user_id = ? WHERE bills_id = ?`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId,bill_id]);
            res.status(200).json({
                bill_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        }

    }
    catch(error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('update', 'update error', 'bills', NOW(), ?, ?)
            `;
            await dbService.query(logQuery, [error.message, 11]);
        } catch (logError) {
            console.error('Error al insertar en la tabla de Logs:', logError);
        }
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la factura!",
            error: error
        })
    }
}

const deleteBill = async (req, res = response) => {
    const { bill_id } = req.body;
    try {

        const userQuery = `UPDATE bills SET activated=0 WHERE FIND_IN_SET(bills_id, ?)`;
        const rows = await dbService.query(userQuery, [bill_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La factura ha sido eliminado exitosamente!"
            });
          
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las facturas han sido eliminados exitosamente!"
            });
        }

        
    } catch (error) {
        try {
            const logQuery = `
                INSERT INTO logs (action, activity, affected_table, date, error_message, user_id)
                VALUES ('delete', 'delete error', 'bills', NOW(), ?, ?)
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
    getBills,
    postBill,
    putBill,
    deleteBill,
    getUserBills,
    getById
}