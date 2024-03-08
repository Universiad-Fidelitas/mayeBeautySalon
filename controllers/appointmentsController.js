const { response } = require('express');
const dbService = require('../database/dbService');
const moment = require('moment');

const getServiceStatus = async (req, res = response) => {
    try {
        const { selected_day } = req.body;
        const weekdays = [];
        
        const startDate = moment(selected_day).startOf('week');
        for (let i = 0; i < 7; i++) {
            const weekday = startDate.clone().add(i, 'days');
            weekdays.push(weekday.format('YYYY-MM-DD'));
        }
    
        const getWeekAppointments = async () => {
            const appointments = {};
            await Promise.all(weekdays.map(async (evaluateDay) => {
                const queryActiveAppointments = 'SELECT * FROM appointments WHERE activated = 1 AND date = ?';
                const activeAppointments = await dbService.query(queryActiveAppointments, [evaluateDay]);
                appointments[evaluateDay] = activeAppointments;
            }));
            return appointments;
        }
        
    
        const weekAppointments = await getWeekAppointments();
    
        res.status(200).json({
            success: true,
            weekAppointments,
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

const getUserDataPrefill = async (req, res = response) => {
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

module.exports = {
    getServiceStatus,
    getUserDataPrefill
}