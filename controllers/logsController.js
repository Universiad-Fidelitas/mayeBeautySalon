const { response } = require('express');
const dbService = require('../database/dbService');

const getLogs = async (req, res = response) => {
  
    try {
        const { pageIndex, pageSize, term, sortBy } = req.body;
       
        res.json({
            pageSize,
            pageIndex,
            pageCount,
            items: logs,
            rowCount: totalRowCount,
        });
    } catch (error) {
      
        console.error('Error al obtener logs:', error);
        logError('getLogs', 'getLogs error', 'logs', error.message);
        res.status(500).json({ message: error.message });
    }
};

const postLog = async (req, res = response) => {

    try {
        const { action, activity, affected_table, error_message, user_id } = req.body;
        res.status(200).json({
            success: true,
            message: "¡El log ha sido agregado exitosamente!",
        });
    } catch (error) {
     
        console.error('Error al agregar log:', error);
        logError('postLog', 'postLog error', 'logs', error.message);
        res.status(500).json({
            success: false,
            message: "¡No es posible agregar el log!",
            error: error.message,
        });
    }
};

module.exports = {
    getLogs,
    postLog,
};
