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

const saveAppointment = async (req, res = response) => {
    try {
        const { selectedService, appointmentDateTime, email } = req.body;
        const queryGetServiceInfo = 'SELECT * FROM services WHERE service_id = ?';
        const serviceInfo = await dbService.query(queryGetServiceInfo, [selectedService.value]);

        const endTime = moment(appointmentDateTime.time, 'HH:mm:ss')
        .add(parseInt(serviceInfo[0].duration.split('.')[0]), 'hours')
        .add(parseInt(serviceInfo[0].duration.split('.')[1]), 'minutes')
        .format('HH:mm:ss');

        
        const queryAddAppointment = 'INSERT INTO appointments (appointment_id, date, start_time, end_time, activated, price) VALUES (NULL, ?, ?, ?, ?, ?);';
        const AppointmentResult = await dbService.query(queryAddAppointment, [appointmentDateTime.date, appointmentDateTime.time, endTime, 1, serviceInfo[0].price]);
        
        res.status(200).json({
            success: true,
            date: appointmentDateTime.date,
            start_time: appointmentDateTime.time,
            price: serviceInfo[0].price,
            serviceName: serviceInfo[0].name,
            email,
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
    getUserDataPrefill,
    saveAppointment
}