const { response } = require('express');
const dbService = require('../database/dbService');
const moment = require('moment');
const sendEmail = require('../utils/email/emailService');

const getServiceStatus = async (req, res = response) => {
    try {
        const { selected_day, service_id, employee } = req.body;
        const weekdays = [];
        
        const startDate = moment(selected_day).startOf('week');
        for (let i = 0; i < 7; i++) {
            const weekday = startDate.clone().add(i, 'days');
            weekdays.push(weekday.format('YYYY-MM-DD'));
        }
    
        const getWeekAppointments = async () => {
            const appointments = {};
            await Promise.all(weekdays.map(async (evaluateDay) => {
                const queryActiveAppointments = 'SELECT * FROM appointments WHERE activated = 1 AND date = ? AND employee = ?';
                const activeAppointments = await dbService.query(queryActiveAppointments, [evaluateDay, employee]);
                appointments[evaluateDay] = activeAppointments;
            }));
            return appointments;
        }

        const queryGetServiceDuration = 'SELECT duration FROM services WHERE service_id = ?';
        const serviceDuration = await dbService.query(queryGetServiceDuration, [service_id]);
        
    
        const weekAppointments = await getWeekAppointments();
        
        const parseTime = (timeFormat) => {
            const [hours, minutes] = timeFormat.split('.');
            const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
            return totalMinutes;
        }

        const checkTime = async (time, appointments) => {
            const format = 'HH:mm:ss';
            const currentTime = moment(time, format);
        
            const results = await Promise.all(appointments.map(async appointment => {
                return await currentTime.isSame(moment(appointment.start_time, format)) || currentTime.isBetween(moment(appointment.start_time, format), moment(appointment.end_time, format));
            }));

            return results.some(result => result);
        }

        const generateTimeSlots = async (startTime, endTime, deltaMinutes) => {
            const timeSlotsData = [];
            const currentTime = moment(startTime);
            const dates = Object.keys(weekAppointments).sort((a, b) => moment(a, 'YYYY-MM-DD').diff(moment(b, 'YYYY-MM-DD')));

            
            while (currentTime < endTime) {
                const time = currentTime.format('HH:mm:ss');
                currentTime.add(deltaMinutes, 'minutes');
                const appointmentsDates = []
                for (const date of dates) {
                    if (weekAppointments.hasOwnProperty(date)) {
                        appointmentsDates.push({date, isSelected: await checkTime(time, weekAppointments[date])})
                    }
                }
                timeSlotsData.push({time, appointmentsDates})
            }
  

            return timeSlotsData;
        }
        
        const timeSlots = await generateTimeSlots(moment('9:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss'), parseTime(serviceDuration[0].duration));
        
        res.status(200).json({
            success: true,
            timeSlots,
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
        const { service_id, service_date, service_time, id_card, first_name, last_name, email, phone, employment_id, id_card_type } = req.body;

        const queryGetServiceInfo = 'SELECT * FROM services WHERE service_id = ?';
        const serviceInfo = await dbService.query(queryGetServiceInfo, [service_id]);

        sendEmail('appointmentConfirmation', email, "Confirmación de cita", {
            selectedServiceName: serviceInfo[0].name,
            selectedDate: moment(service_date).locale('es').format('dddd DD [de] MMMM [del] YYYY'),
            selectedTime: moment(service_time, 'HH:mm:ss').format('hh:mmA'),
            servicePrice: serviceInfo[0].price,
        });

        const endTime = moment(service_time, 'HH:mm:ss')
        .add(parseInt(serviceInfo[0].duration.split('.')[0]), 'hours')
        .add(parseInt(serviceInfo[0].duration.split('.')[1]), 'minutes')
        .format('HH:mm:ss');

        const queryAddAppointment = 'INSERT INTO appointments (appointment_id, date, start_time, end_time, activated, price, employee) VALUES (NULL, ?, ?, ?, ?, ?, ?)';
        const { insertId } = await dbService.query(queryAddAppointment, [moment(service_date).format('YYYY-MM-DD'), service_time, endTime, 1, serviceInfo[0].price, employment_id]);

        const queryAddServiceAppointment = "INSERT INTO `services-appointments` (`service_appointment_id`, service_id, appointment_id, extra, extra_description) VALUES (NULL, ?, ?, ?, ?);";
        const serviceAppointmentResult = await dbService.query(queryAddServiceAppointment, [service_id, insertId, 0, '']);

        const queryUserChecker = "SELECT * FROM users WHERE id_card = ? ";
        const userChecker = await dbService.query(queryUserChecker, [id_card]);


        // se agrega estas lineas para evitar un error en la creacion del bill
        const userQuery = `INSERT INTO payments(status, payment_type, voucher_path, sinpe_phone_number, activated) VALUES (?,?,'','', 1)`;
        const { insertId: paymentInsertId } = await dbService.query(userQuery, ['pending', 'efectivo']);


        if (userChecker.length === 0) {
            const queryAddUser = "INSERT INTO users (user_id, role_id, id_card, first_name, last_name, email, phone, id_card_type, activated, image, salary) VALUES (NULL, 7, ?, ?, ?, ?, ?, 'nacional', 1, '', NULL)";
            const { insertId: userInsertId } = await dbService.query(queryAddUser, [id_card, first_name, last_name, email, phone]);
            const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id, activated) VALUES (NULL, ?, NULL, ?, ?, 1) ";
            await dbService.query(queryAddBill, [userInsertId, insertId, paymentInsertId]);
        } else { 
            const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id, activated) VALUES (NULL, ?, NULL, ?, ?, 1) ";
            await dbService.query(queryAddBill, [userChecker[0].user_id, insertId, paymentInsertId]);
        }
        
        res.status(200).json({
            userCheckers: userChecker.length === 0,
            success: true,
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
        const { id, start, end, service_appointment_id, service_id, extra, extra_description, user_id, employee }  = req.body;

        const queryUpdateAppointment = 'UPDATE appointments SET date = ?, start_time = ?, end_time = ?, activated = ?, employee = ? WHERE appointment_id = ?';
        await dbService.query(queryUpdateAppointment, [moment(start).format('YYYY-MM-DD'), moment(start).format('HH:mm:ss'), moment(end).format('HH:mm:ss'), 1 , employee, id]);
    
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
        const { start, end, service_id, extra, extra_description, user_id, employee }  = req.body;

        const queryServicePrice = 'SELECT price FROM services WHERE service_id = ?';
        const servicePrice = await dbService.query(queryServicePrice, [service_id]);

        const queryAddAppointment = 'INSERT INTO appointments (appointment_id, date, start_time, end_time, activated, price, employee) VALUES (NULL, ?, ?, ?, ?, ?, ?)';
        const { insertId } = await dbService.query(queryAddAppointment, [moment(start).format('YYYY-MM-DD'), moment(start).format('HH:mm:ss'), moment(end).format('HH:mm:ss'), 1 , servicePrice[0].price, employee]);
        

        // se agrega estas lineas para evitar un error en la creacion del bill

        const userQuery = `INSERT INTO payments(status, payment_type, voucher_path, sinpe_phone_number, activated) VALUES (?,?,'','', 1)`;
        const { insertId: paymentInsertId } = await dbService.query(userQuery, ['pending', 'efectivo']);

        const queryAddServicesAppointmets = 'INSERT INTO `services-appointments` (service_appointment_id, service_id, appointment_id, extra, extra_description) VALUES (NULL, ?, ?, ?, ?)';
        await dbService.query(queryAddServicesAppointmets, [service_id, insertId, extra, extra_description]);

        const queryAddBill = "INSERT INTO bills (bills_id, user_id, inventory_id, appointment_id, payment_id, activated) VALUES (NULL, ?, NULL, ?, ?, 1) ";
        await dbService.query(queryAddBill, [user_id, insertId, paymentInsertId]);

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

