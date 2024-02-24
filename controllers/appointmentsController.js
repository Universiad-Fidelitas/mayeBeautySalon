const { response } = require('express');
const dbService = require('../database/dbService');

const getServiceStatus = async (req, res = response) => {
    try {
        const { service_id, selected_day } = req.body;
        const queryActiveAppointments = 'SELECT * FROM appointments WHERE activated = 1 AND date = ?';
        const activeAppointments = await dbService.query(queryActiveAppointments, [selected_day]);

        const queryGetServiceData = 'SELECT * FROM services WHERE service_id = ?';
        const serviceData = await dbService.query(queryGetServiceData, [service_id]);
    
        
        const services = await dbService.query('SELECT * FROM services WHERE activated = 1');
        res.status(200).json({
            success: true,
            activeAppointments,
            message: "services.successAdd"
        })
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
    getServiceStatus
}