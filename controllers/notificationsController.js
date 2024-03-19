const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { notification_id } = req.params;
    try {
        const [notificationFound] = await dbService.query('SELECT * FROM notifications WHERE activated = 1 AND notification_id = ?', [notification_id]);
        console.log(notificationFound)
        res.status(500).json({notificationFound, status: true, message: 'Se ha encontrado la notification exitosamente.' });
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getNotifications = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'SELECT `notification_id`, `activated`, `product_id`, `amount`, `name` FROM `product_notifications`';
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
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_notifications`);
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

const postNotification = async (req, res = response) => {
    const { product_id, amount } = req.body;
    try {
        const userQuery = `CALL sp_notification('create', '0', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [amount, product_id]);

                res.status(200).json({
                    notification_id: insertId,
                    success: true,
                    message: "¡La notificación ha sido agregada exitosamente!"
                })
                try {
                    const userQuery2 = `CALL check_amount_after_notification(?,?);`;
                    const { insertId } = await dbService.query(userQuery2, [product_id, amount]);

                }      
                catch({ message }) {

                }  

    }
    catch({ message }) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la notificación!",
            error: message
        })
    }
}


const putNotification = async (req, res = response) => {
    const { notification_id } = req.params;
    const { product_id, amount } = req.body;
    try {
        const userQuery = `CALL sp_notification('update', ?, ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [notification_id, amount, product_id  ]);
        res.status(200).json({
            notification_id: insertId,
            success: true,
            message: "¡La notificación ha sido editada exitosamente!"
        })
        try {
            const userQuery2 = `CALL check_amount_after_notification(?,?);`;
            const { insertId } = await dbService.query(userQuery2, [product_id, amount]);

        }      
        catch({ message }) {

        }  
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la notificación!",
            error: error
        })
    }
}

const deleteNotification = async (req, res = response) => {
    const { notification_id } = req.body;
    try {
        const userQuery = `CALL sp_notification('delete', ?, '', 0);`;
        const rows = await dbService.query(userQuery, [notification_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La notificación ha sido eliminada exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las notificaciones han sido eliminadas exitosamente!"
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
    getNotifications,
    postNotification,
    putNotification,
    deleteNotification,
    getById
}