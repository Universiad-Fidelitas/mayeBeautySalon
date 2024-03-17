import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Table, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useGetWeekAppointments } from 'hooks/react-query/useAppointments';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { setServiceDateTime } from 'store/appointments/appointmentsSlice';

export const FirstDataRequestTap = ({ formRef }) => {
  const [selectedService, setSelectedService] = useState();
  const [appointmentDateTime, setappointmentDateTime] = useState();
  const [serviceDate, setServiceDate] = useState( new Date);
  const { isSuccess, data } = useGetAllServices();
  const { data: weekAppointmentsData, isSuccess: isWeekAppointmentsDataSuccess, refetch  } = useGetWeekAppointments(serviceDate);
  const { formatMessage: f, formatDate } = useIntl();
  const { services } = data || {};
  const dispatch = useDispatch();
  const { selectedAppointments } = useSelector((state) => state.appointments);
  const serviceOptions = useMemo(() => data?.services?.map((service) => { return { value: service.service_id, label: service.name }}), [data])
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
  useEffect(() => {
    refetch()
  }, [serviceDate])

  useEffect(() => {
    if (selectedAppointments && selectedAppointments.appointmentDateTime) {
      setappointmentDateTime(selectedAppointments.appointmentDateTime)
      setServiceDate(moment(selectedAppointments.appointmentDateTime.date, 'YYYY-MM-DD').toDate())
      setSelectedService(selectedAppointments.selectedService)
    }
  }, [selectedAppointments])

  const daysWithDate = useMemo(() => {
    const selectedDayIndex = serviceDate?.getDay();
    const days = [];
    daysOfWeek.forEach((dayName, index) => {
        const date = new Date(serviceDate);
        date.setDate(serviceDate.getDate() + index - selectedDayIndex);
        days.push({ name: dayName, date });
      });
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
      let currentMinutes = 9 * 60;
      const closeTime = 18 * 60;
      while (currentMinutes <= closeTime) {
        const hour = Math.floor(currentMinutes / 60);
        const minute = currentMinutes % 60;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedHour = hour % 12 || 12;
        const formattedMinute = minute.toString().padStart(2, '0');
        const currentTime = `${formattedHour}:${formattedMinute} ${period}`;
        slots.push({ time: currentTime });
        currentMinutes += intervalInMinutes;
      }
      return slots;
    }
    return [];
  }, [intervalInMinutes, isSuccess, selectedService]);

  const isDateTimeSelected = useCallback((dayDate, dayTime) => {
    if(isWeekAppointmentsDataSuccess && weekAppointmentsData?.weekAppointments[dayDate]?.length > 0){
      return weekAppointmentsData.weekAppointments[dayDate].some(appointment => appointment.start_time === dayTime)
      } 
      return false
    },[isWeekAppointmentsDataSuccess, weekAppointmentsData])

    const onAppointmentSelected = useCallback((dayDate, dayTime) => {
      setappointmentDateTime({
        time: dayTime,
        date: dayDate
      })
      
      dispatch(setServiceDateTime({ ...selectedAppointments, appointmentDateTime: {
        time: dayTime,
        date: dayDate
      }}));
    },[setappointmentDateTime, selectedAppointments])
  

    const OnSelectButton = useCallback(({dayDate, dayTime}) => {
      if (appointmentDateTime?.date === dayDate && appointmentDateTime?.time === dayTime) {
        return <Button variant='success'>{ f({ id: 'helper.selected' }) }</Button>
      }
        if (isDateTimeSelected(dayDate, dayTime)) {
        return <Button variant='warning'>{ f({ id: 'helper.unavailable' }) }</Button>
      } 
      return <Button variant={dayDate === moment(serviceDate).format('YYYY-MM-DD') ? 'outline-white' : 'outline-primary' } onClick={() => onAppointmentSelected(dayDate, dayTime)}>{ f({ id: 'helper.available' }) }</Button>
    }, [appointmentDateTime, isDateTimeSelected, onAppointmentSelected, serviceDate, f])

    const timeslots = useMemo(() => generateTimeSlots(), [generateTimeSlots]);

    const onSelectedService = useCallback((service) => {
      console.log('onSelectedService', service)
      setappointmentDateTime(null)
      setSelectedService(service);
      dispatch(setServiceDateTime({ selectedService: service }));
    }, []);

  return (
    <div>
    <Formik 
      innerRef={formRef[0]}
      initialValues={{}}
      onSubmit={() => {
        dispatch(setServiceDateTime({ appointmentDateTime, selectedService }));
      }}
    >
      {() => (
        <Form>
          <h5 className="card-title">{f({ id: 'appointments.FirstTaptitle' })}</h5>
          <p className="card-text text-alternate mb-4">{f({ id: 'appointments.FirstTapDescription' })} </p>
          <Select className='w-20 mb-3' classNamePrefix="react-select" options={serviceOptions} value={selectedService} onChange={onSelectedService} placeholder='Seleccione Servicio' />
         
          {
            selectedService?.value && (
              <>
                <DatePicker className="form-control mb-5 w-20" dateFormat='MMMM d, yyyy' selected={serviceDate} onChange={(date) => setServiceDate(date)} placeholderText="Seleccione el dia"/>
                <section className="scroll-section">
                  <h2 className="small-title">Citas disponibles</h2>
                  <Card body className="mb-5">
                    <Table striped hover className='appointments-table'>
                      <thead>
                        <tr>
                          <th>{ f({ id: 'helper.time' })}</th>
                          {daysWithDate.map((day) => (
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
                                <OnSelectButton dayDate={moment(day.date).format('YYYY-MM-DD')} dayTime={moment(timeslot.time, 'h:mm A').format('HH:mm:ss')} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>
                </section>
              
              </>
              

            )
          }
        </Form>
      )}
    </Formik>
  </div>
  )
}