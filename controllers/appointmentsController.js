const { response } = require('express');
const dbService = require('../database/dbService');
const moment = require('moment');
const sendEmail = require('../utils/email/emailService');

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
        const { selectedService, appointmentDateTime, id_card, first_name, last_name, email, phone } = req.body;
        const queryGetServiceInfo = 'SELECT * FROM services WHERE service_id = ?';
        const serviceInfo = await dbService.query(queryGetServiceInfo, [selectedService.value]);

        sendEmail('appointmentConfirmation', email, "Confirmación de cita", {
            selectedServiceName: serviceInfo[0].name,
            selectedDate: moment(appointmentDateTime.date).locale('es').format('dddd DD [de] MMMM [del] YYYY'),
            selectedTime: moment(appointmentDateTime.time).format('hh:mm A'),
            servicePrice: serviceInfo[0].price,
        });

        const endTime = moment(appointmentDateTime.time, 'HH:mm:ss')
        .add(parseInt(serviceInfo[0].duration.split('.')[0]), 'hours')
        .add(parseInt(serviceInfo[0].duration.split('.')[1]), 'minutes')
        .format('HH:mm:ss');

        const queryAddAppointment = 'INSERT INTO appointments (appointment_id, date, start_time, end_time, activated, price) VALUES (NULL, ?, ?, ?, ?, ?);';
        const { insertId } = await dbService.query(queryAddAppointment, [appointmentDateTime.date, appointmentDateTime.time, endTime, 1, serviceInfo[0].price]);

        const queryAddServiceAppointment = "INSERT INTO `services-appointments` (`service_appointment_id`, service_id, appointment_id, extra, extra_description) VALUES (NULL, ?, ?, ?, ?);";
        const serviceAppointmentResult = await dbService.query(queryAddServiceAppointment, [selectedService.value, insertId, 0, '']);

        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";
        const userChecker = await dbService.query(queryUserChecker, [id_card]);

        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (user_id, role_id, id_card, first_name, last_name, email, phone, activated, image, salary) VALUES (NULL, 1, ?, ?, ?, ?, ?, 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card, first_name, last_name, email, phone]);
            const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id) VALUES (NULL, ?, NULL, ?, NULL) ";
            await dbService.query(queryAddBill, [userInsertId, insertId]);
        } else { 
            const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id) VALUES (NULL, ?, NULL, ?, NULL) ";
            await dbService.query(queryAddBill, [userChecker[0].user_id, insertId]);
        }
        
        res.status(200).json({
            userCheckers: userChecker.length === 0,
            success: true,
            date: appointmentDateTime.date,
            start_time: appointmentDateTime.time,
            price: serviceInfo[0].price,
            serviceName: serviceInfo[0].name,
            email,
            serviceAppointmentResult,
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

const getAppointments = async (req, res = response) => {
    try {
        const { monthNumber } = req.body;
        const queryActiveAppointments = 'SELECT * FROM appointments_info WHERE MONTH(start) IN (?, ?, ?) AND activated = 1';
        const monthAppointments = await dbService.query(queryActiveAppointments, [monthNumber - 1, monthNumber, monthNumber + 1]);
    
        res.status(200).json({
            success: true,
            monthAppointments,
            monthNumber,
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

const getAppointmentsUsers = async (req, res = response) => {
    try {
        const queryActiveAppointments = 'SELECT user_id, first_name, last_name, email, phone FROM users';
        const activeUsers = await dbService.query(queryActiveAppointments);
    
        res.status(200).json({
            success: true,
            activeUsers,
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

const updateAppointment = async (req, res = response) => {
    try {
        const { id, start, end, service_appointment_id, service_id, extra, extra_description, user_id }  = req.body;

        const queryUpdateAppointment = 'UPDATE appointments SET date = ?, start_time = ?, end_time = ?, activated = ? WHERE appointment_id = ?';
        await dbService.query(queryUpdateAppointment, [moment(start).format('YYYY-MM-DD'), moment(start).format('HH:mm:ss'), moment(end).format('HH:mm:ss'), 1 , id]);
    
        const queryActiveAppointments = 'UPDATE `services-appointments` SET service_id = ?, extra = ?, extra_description = ? WHERE service_appointment_id = ?';
        const monthAppointments = await dbService.query(queryActiveAppointments, [service_id, extra, extra_description, service_appointment_id]);
        
        const queryAddBill = "UPDATE bills SET user_id = ? WHERE appointment_id = ?";
        await dbService.query(queryAddBill, [user_id, id]);

        const queryServiceInformation = 'SELECT * FROM services WHERE service_id = ?';
        const serviceData = await dbService.query(queryServiceInformation, [service_id]);

        const queryGetUserAppInfo = 'SELECT * FROM users WHERE user_id = ?';
        const getUserAppInfo = await dbService.query(queryGetUserAppInfo, [user_id]);

        sendEmail('appointmentConfirmation', getUserAppInfo[0].email, "Confirmación de cita", {
            selectedServiceName: serviceData[0].name,
            selectedDate: moment(start).locale('es').format('dddd DD [de] MMMM [del] YYYY'),
            selectedTime: moment(start).format('hh:mm A'),
            servicePrice: serviceData[0].price,
        });
        
        res.status(200).json({
            success: true,
            monthAppointments,
            message: "appointments.successEdit"
        });
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "appointments.errorEdit",
            error: error.message
        })
    }
}

const addAppointment = async (req, res = response) => {
    try {
        const { start, end, service_id, extra, extra_description, user_id }  = req.body;

        const queryServicePrice = 'SELECT price FROM services WHERE service_id = ?';
        const servicePrice = await dbService.query(queryServicePrice, [service_id]);

        const queryAddAppointment = 'INSERT INTO appointments (appointment_id, date, start_time, end_time, activated, price) VALUES (NULL, ?, ?, ?, ?, ?);';
        const { insertId } = await dbService.query(queryAddAppointment, [moment(start).format('YYYY-MM-DD'), moment(start).format('HH:mm:ss'), moment(end).format('HH:mm:ss'), 1 , servicePrice[0].price]);
    
        const queryAddServicesAppointmets = 'INSERT INTO `services-appointments` (service_appointment_id, service_id, appointment_id, extra, extra_description) VALUES (NULL, ?, ?, ?, ?)';
        await dbService.query(queryAddServicesAppointmets, [service_id, insertId, extra, extra_description]);

        const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id) VALUES (NULL, ?, NULL, ?, NULL) ";
        await dbService.query(queryAddBill, [user_id, insertId]);

        const queryServiceInformation = 'SELECT * FROM services WHERE service_id = ?';
        const serviceData = await dbService.query(queryServiceInformation, [service_id]);

        const queryGetUserAppInfo = 'SELECT * FROM users WHERE user_id = ?';
        const getUserAppInfo = await dbService.query(queryGetUserAppInfo, [user_id]);

        sendEmail('appointmentConfirmation', getUserAppInfo[0].email, "Confirmación de cita", {
            selectedServiceName: serviceData[0].name,
            selectedDate: moment(start).locale('es').format('dddd DD [de] MMMM [del] YYYY'),
            selectedTime: moment(start).format('hh:mm A'),
            servicePrice: serviceData[0].price,
        });
        
        res.status(200).json({
            success: true,
            addAppointment,
            insertId,
            message: "appointments.successAdd"
        });
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "appointments.errorAdd",
            error: error.message
        })
    }
}

const disableAppointment = async (req, res = response) => {
    try {
        const { id }  = req.body;

        const queryUpdateAppointment = 'UPDATE appointments SET activated = 0, price = 0 WHERE appointment_id = ?';
        const updatedAppointment = await dbService.query(queryUpdateAppointment, [id]);
        
        res.status(200).json({
            success: true,
            updatedAppointment,
            message: "appointments.successDelete"
        });
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "appointments.errorDelete",
            error: error.message
        })
    }
}

module.exports = {
    getServiceStatus,
    getUserDataPrefill,
    saveAppointment,
    getAppointments,
    updateAppointment,
    addAppointment,
    disableAppointment,
    getAppointmentsUsers
}

