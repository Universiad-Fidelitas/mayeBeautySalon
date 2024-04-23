const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { bills_id } = req.params;
    try {
        const [billFound] = await dbService.query('SELECT * FROM bill_view WHERE activated = 1 AND bills_id = ?', [bills_id]);
        const productQuery = `SELECT i.amount, i.product_id, i.invetory_products_id, p.name, p.price FROM inventory_products i left join products p on i.product_id = p.product_id WHERE inventory_id = ?`;
        const productData = await dbService.query(productQuery,[billFound.inventory_id]);
        billFound.dataToInsert = productData;
        res.status(200).json({billFound, status: true, message: 'Se ha encontrado la factura exitosamente.' });
    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({message: error.message})
    }
}

const getBills = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy, term2, term3} = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select * from bill_view where activated = 1';
        let querytotal = `SELECT COALESCE(appointment_price, 0) + COALESCE(inventory_price, 0) AS total_price FROM bill_view where activated = 1`;
        if (term) {
            baseQuery += ` AND id_card LIKE '%${term}%'`;
            querytotal += ` AND id_card LIKE '%${term}%'`;
        }
        
        if (term2 && term3) {
            baseQuery += ` AND inventory_date BETWEEN '${term2}' AND '${term3}' OR appointment_date BETWEEN '${term2}' AND '${term3}'`;
            querytotal += ` AND inventory_date BETWEEN '${term2}' AND '${term3}' OR appointment_date BETWEEN '${term2}' AND '${term3}'`;
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
            querytotal += ` ORDER BY ${orderByClauses.join(', ')}`;
        }
        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
        const ttoal = `SELECT SUM(total_price) AS TotalPrice from (${querytotal} LIMIT ${pageSize} OFFSET ${offset}) AS subquery_alias`;
        const rows = await dbService.query(query);
        console.log(ttoal)
        const total = await dbService.query(ttoal);
        for (const row of rows) {
            const inventoryId = row.inventory_id;
            const productQuery = `SELECT i.amount, i.product_id, i.invetory_products_id, p.name, p.price FROM inventory_products i left join products p on i.product_id = p.product_id WHERE inventory_id = ${inventoryId}`;
            const productData = await dbService.query(productQuery);
            row.dataToInsert = productData;
        };
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_bills`);
        const totalRowCount = totalRowCountResult[0].count;

        const pageCount = Math.ceil(totalRowCount / pageSize);

        const response = {
            pageSize,
            pageIndex,
            pageCount,
            items: rows,
            total: total[0].TotalPrice,
            rowCount: totalRowCount,
        };

        res.json(response);
    } catch (error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(500).json({ message: error.message });
    }
}

const getBillsCSV = async (req, res = response) => {
    const { term, sortBy, term2, term3} = req.body;
    try {

        let baseQuery = 'select * from bill_view where activated = 1';
        if (term) {
            baseQuery += ` AND id_card LIKE '%${term}%'`;
        }
        
        if (term2 && term3) {
            baseQuery += ` AND inventory_date BETWEEN '${term2}' AND '${term3}' OR appointment_date BETWEEN '${term2}' AND '${term3}'`;
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
        const query = `${baseQuery}`;
        const rows = await dbService.query(query);
        for (const row of rows) {
            const inventoryId = row.inventory_id;
            const productQuery = `SELECT i.amount, i.product_id, i.invetory_products_id, p.name, p.price FROM inventory_products i left join products p on i.product_id = p.product_id WHERE inventory_id = ${inventoryId}`;
            const productData = await dbService.query(productQuery);
            row.dataToInsert = productData;
        }

        const response = {
            items: rows
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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "services.errorAdd",
            error: error.message
        })
    }
}
const postBill = async (req, res = response) => {
    const {  status, payment_type, sinpe_phone_number, description, dataToInsert, id_card,id_card_type, first_name, last_name, email, phone, appointment_id } = req.body;
    try {
        const userQuery = `INSERT INTO payments(status, payment_type, sinpe_phone_number) VALUES (?, ?, ?);`;
        const { insertId: paymentInsertId } = await dbService.query(userQuery, [status, payment_type, sinpe_phone_number]);
        const userQuery2 = `INSERT INTO inventory ( action, price, date, description) VALUES ('remove', ?, CURRENT_TIMESTAMP, ?);`;
        const { insertId: inventoryInsertId } = await dbService.query(userQuery2, [ 0 , description]);

        for (const data of dataToInsert) {
            const query = 'INSERT INTO `inventory_products` (amount, inventory_id, product_id) VALUES (?, ?, ?);';
            console.log([data.amount, inventoryInsertId, data.product_id]);
            const { insertId: userInsertId }= await dbService.query(query, [data.amount, inventoryInsertId, data.product_id]);
            
        }
       
        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";

        const userChecker = await dbService.query(queryUserChecker, [id_card]); 

        let userInsertId;
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'create', 'Creación de factura']);

        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (role_id, id_card, id_card_type, first_name, last_name, email, phone, activated, image, salary) VALUES ( 7, ?, ?, ?, ?, ?, ?, 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card,id_card_type, first_name, last_name, email, phone]);
            const queryAddBill =`INSERT INTO bills(user_id, inventory_id, payment_id, activated) VALUES (?, ?, ?, 1)`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId, inventoryInsertId, paymentInsertId]);
            if(appointment_id > 0){
                const queryAddBill =`UPDATE bills SET appointment_id = ? WHERE bills_id = ?`;
                await dbService.query(queryAddBill, [appointment_id, billInsertId]);
            }
            res.status(200).json({
                bills_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        } else { 
            userInsertId  = userChecker[0].user_id
            const queryAddBill =`INSERT INTO bills(user_id, inventory_id, payment_id, activated) VALUES (?, ?, ?, 1)`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId, inventoryInsertId, paymentInsertId]);
            if(appointment_id > 0){
                const queryAddBill =`UPDATE bills SET appointment_id = ? WHERE bills_id = ?`;
                await dbService.query(queryAddBill, [appointment_id, billInsertId]);
            }
            res.status(200).json({
                bills_id: billInsertId,
                success: true,
                message: "¡La factura ha sido agregada exitosamente!"
            })
        }

    }
    catch(error) {
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la factura!",
            error: message
        })
    }
}

const putBill = async (req, res = response) => {
    const { bills_id } = req.params;
    const { status, payment_type, sinpe_phone_number, description, dataToInsert, id_card,id_card_type, first_name, last_name, email, phone, payment_id, inventory_id, appointment_id } = req.body;

    try {
        if(payment_id===null){
            const userQuery = `INSERT INTO payments(status, payment_type, voucher_path, sinpe_phone_number) VALUES (?,?,'',?)`;
            const { insertId: paymentInsertId } = await dbService.query(userQuery, [status, payment_type, sinpe_phone_number]);
            const queryAddBill =`UPDATE bills SET payment_id = ? WHERE bills_id = ?`;
            await dbService.query(queryAddBill, [paymentInsertId,bills_id]);
        }else{
            const userQuery = `UPDATE payments SET status= ?, payment_type= ?, sinpe_phone_number= ? WHERE payment_id= ?`;
            await dbService.query(userQuery, [status, payment_type, sinpe_phone_number, payment_id]);
        }
        if(appointment_id > 0){
            const queryAddBill =`UPDATE bills SET appointment_id = ? WHERE bills_id = ?`;
            await dbService.query(queryAddBill, [appointment_id, bills_id]);
        }
        const userQuery2 = `UPDATE inventory SET description= ? WHERE inventory_id = ? ;`;
        await dbService.query(userQuery2, [ description, inventory_id]);

        // Delete items not included in dataToInsert
        const existingItemIds = dataToInsert.map((data) => data.invetory_products_id).filter((id) => id !== 0);
        let formattedIds = existingItemIds.join(',');
        if (formattedIds.endsWith(",")) {
            formattedIds = formattedIds.slice(0, -1);
        }

        if(formattedIds!==''){
            const  deleteQuery = `DELETE FROM inventory_products WHERE invetory_products_id NOT IN (${formattedIds}) AND inventory_id = ?`;
            await dbService.query(deleteQuery, [ inventory_id])
        }

        for (const data of dataToInsert) {
            if (data.invetory_products_id === 0) {
                // Insert new item
                if(inventory_id === undefined || inventory_id === null || inventory_id === 0){
                    const userQuery2 = `INSERT INTO inventory ( action, price, date, description) VALUES ('remove', ?, CURRENT_TIMESTAMP, ?);`;
                    const { insertId: inventoryInsertId } = await dbService.query(userQuery2, [ 0 , description]);
                    const queryAddBill =`UPDATE bills SET inventory_id = ? WHERE bills_id = ?`;
                    await dbService.query(queryAddBill, [inventoryInsertId,bills_id]);
                    const insertItemQuery = 'INSERT INTO inventory_products (amount, product_id, inventory_id) VALUES (?, ?, ?)';
                    await dbService.query(insertItemQuery, [data.amount, data.product_id, inventoryInsertId]);
                }else{
                    const insertItemQuery = 'INSERT INTO inventory_products (amount, product_id, inventory_id) VALUES (?, ?, ?)';
                    await dbService.query(insertItemQuery, [data.amount, data.product_id, inventory_id]);
                    
                }
            } else {
                // Update existing item
                const updateItemQuery = 'UPDATE inventory_products SET amount = ?, product_id = ? WHERE invetory_products_id = ? AND inventory_id = ?';
                await dbService.query(updateItemQuery, [data.amount, data.product_id, data.invetory_products_id, inventory_id]);
            }
        }
        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";
        const userChecker = await dbService.query(queryUserChecker, [id_card]); 
        let userInsertId;
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'update', 'Cambios en factura']);

        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (role_id, id_card,id_card_type, first_name, last_name, email, phone, activated, image, salary) VALUES ( 1, ?,?, ?, ?, ?, ?, 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card,id_card_type, first_name, last_name, email, phone]);
            const queryAddBill =`UPDATE bills SET user_id = ? WHERE bills_id = ?`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId,bills_id]);
            res.status(200).json({
                bills_id: billInsertId,
                success: true,
                message: "¡La factura ha sido editada exitosamente!"
            })
        } else { 
            userInsertId  = userChecker[0].user_id
            const queryAddBill =`UPDATE bills SET user_id = ? WHERE bills_id = ?`;
            const { insertId: billInsertId } = await dbService.query(queryAddBill, [userInsertId,bills_id]);
            res.status(200).json({
                bills_id: billInsertId,
                success: true,
                message: "¡La factura ha sido editada exitosamente!"
            })
        }

    }
    catch(error) {

        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la factura!",
            error: error
        })
    }
}

const deleteBill = async (req, res = response) => {
    const { bills_id } = req.body;
    try {
        const userQuery = `UPDATE bills SET activated=0 WHERE FIND_IN_SET(bills_id, ?)`;
        const rows = await dbService.query(userQuery, [bills_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'delete', 'Inactivación de factura']);

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
        await dbService.query('INSERT INTO logs (log_id, affected_table, user_id, log_type, description) VALUES (NULL, ?, ?, ?, ?)', ['Facturas', req.header('CurrentUserId'), 'error', error.message]);
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

module.exports = {
    getBills,
    getBillsCSV,
    postBill,
    putBill,
    deleteBill,
    getUserBills,
    getById
}