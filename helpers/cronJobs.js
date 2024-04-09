const cron = require('node-cron');
const dbService = require('../database/dbService');
const moment = require('moment');
const sendEmail = require('../utils/email/emailService');

// Schedule cron job to run every day at a specific time
const appointmentsReminder = cron.schedule('0 0 0 * * *', async () => {
  try {
    const queryAppointmentsReminder = 'SELECT * FROM appointments_reminder';
    const appointments = await dbService.query(queryAppointmentsReminder, []);

    appointments.forEach(({ date, start_time, price, email }) => {
      sendEmail('appointmentReminder', email, "Recordatorio de la cita", {
        selectedDate: moment(date).locale('es').format('dddd DD [de] MMMM [del] YYYY'),
        selectedTime: moment(start_time, 'HH:mm:ss').format('hh:mmA'),
        servicePrice: price,
      });
    });
  console.log('CRON RUNNING SUCCSESSFULLY')
  } catch (error) {
    console.log('ERROR IN CRON', error)
  }
}, { timezone: 'America/Costa_Rica' });

module.exports = {
  appointmentsReminder
}