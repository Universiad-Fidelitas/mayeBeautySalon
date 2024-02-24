import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form, Table, Card } from 'react-bootstrap';
import { Formik } from 'formik';

import Select from 'react-select';

import DatePicker from 'react-datepicker';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

export const FirstDataRequestTap = ({ formRef }) => {
    const [selectedService, setSelectedService] = useState();
    const [serviceDate, setServiceDate] = useState(new Date());
    const { isSuccess, data } = useGetAllServices();
    const { formatMessage: f, formatDate } = useIntl();
    const { services } = data || {};

    const [selectedTime, setSelectedTime] = useState(null);
    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });


    const serviceOptions = useMemo(() => data?.services.map((service) => { return { value: service.service_id, label: service.name }}), [data])

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const daysWithDate = useMemo(() => {
        const selectedDayIndex = serviceDate?.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const days = [];
        daysOfWeek.forEach((dayName, index) => {
            const date = new Date(serviceDate);
            date.setDate(serviceDate.getDate() + index - selectedDayIndex);
            days.push({ name: dayName, date });
          });
        console.log('selectedDayIndex', days)
        return days;
      }, [serviceDate]);

        const intervalInMinutes = useMemo(() => {
          if (isSuccess && selectedService?.value) {
            const selectedServiceDuration = services.find(service => service.service_id === selectedService.value)?.duration;
            if (selectedServiceDuration) {
              const [hours, minutes] = selectedServiceDuration.split('.').map(parseFloat);
              return hours * 60 + minutes;
            }
          }
          return 0;
        }, [services, selectedService, isSuccess]);
      
        const generateTimeSlots = useCallback(() => {
          if (isSuccess && selectedService?.value) {
            const slots = [];
            let currentMinutes = 9 * 60; // Start at 9:00 AM converted to minutes
            const closeTime = 18 * 60; // 6:00 PM converted to minutes
            while (currentMinutes <= closeTime) {
              const hour = Math.floor(currentMinutes / 60);
              const minute = currentMinutes % 60;
              const period = hour < 12 ? 'AM' : 'PM';
              const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
              const formattedMinute = minute.toString().padStart(2, '0'); // Ensure minute is always two digits
              const currentTime = `${formattedHour}:${formattedMinute} ${period}`;
              slots.push({ time: currentTime });
              currentMinutes += intervalInMinutes;
            }
            return slots;
          }
          return [];
        }, [intervalInMinutes, isSuccess, selectedService]);
      
        const timeslots = useMemo(() => generateTimeSlots(), [generateTimeSlots]);
    
      
  return (
    <div>
    <Formik 
      innerRef={formRef[0]}
      initialValues={{
        firstName: fields.firstName,
        lastName: fields.lastName,
        selectedDate: new Date(),
      }}
      validateOnMount
      onSubmit={() => {}}
    >
      {({ errors, touched }) => (
        <Form>
          <h5 className="card-title">Servicio</h5>
          <p className="card-text text-alternate mb-4">Descriocion </p>
          <Select className='w-50 mb-3' classNamePrefix="react-select" options={serviceOptions} value={selectedService} onChange={setSelectedService} placeholder='Seleccione Servicio' />
          <DatePicker className="form-control mb-5" dateFormat='MMMM d, yyyy' selected={serviceDate} onChange={(date) => setServiceDate(date)} placeholderText="Seleccione el dia"/>
          {
  selectedService?.value && (
    <section className="scroll-section">
            <h2 className="small-title">Citas disponibles</h2>
          <Card body className="mb-5">




      <Table striped hover className='appointments-table'>
      <thead>
          <tr>
            <th>Time</th>
            {daysWithDate.map((day, index) => (
              <th key={day.name}  className={classNames('table-cell firstchild', { selectedCellDate: day.date.toDateString() === serviceDate.toDateString() },)}>
                <h5 className={`m-0 text-center ${day.date.toDateString() === serviceDate.toDateString() ? 'text-white' : 'text-black'}`}>{ f({ id: `helper.${day.name}` }) }</h5>
                <p className={`m-0 text-center ${day.date.toDateString() === serviceDate.toDateString() ? 'text-white' : 'text-primary'}`}>{formatDate(day.date, { month: 'long', day: 'numeric' })}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeslots.map((timeslot, index) => (
            <tr key={timeslot.time}>
              <td>{timeslot.time}</td>
              {daysWithDate.map(day => (
                <td key={`${day}-${timeslot.time}`} className={classNames('table-cell', { selectedCellDate: day.date.toDateString() === serviceDate.toDateString(), lastchild:  (index === timeslots.length - 1) && day.date.toDateString() === serviceDate.toDateString()})}>
                  {/* Render your content for each timeslot and day */}
                  <Button
                    variant={day.date.toDateString() === serviceDate.toDateString() ? 'outline-white' : 'outline-primary' }
                    // variant={formik.values.selectedSlot === `${day}-${timeslot.time}` ? 'primary' : 'outline-primary'}
                    // onClick={() => handleSlotClick(day, timeslot.time)}
                  >
                    {/* You can customize the button label */}
         {/* ]         {formik.values.selectedSlot === `${day}-${timeslot.time}` ? 'Selected' : 'Select'} */}
                    Seleccionar
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      
      </Card>
      </section>
  )
}
          
        </Form>
      )}
    </Formik>
  </div>
  )
}
