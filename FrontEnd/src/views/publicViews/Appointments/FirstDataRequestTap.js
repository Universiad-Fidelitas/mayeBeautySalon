import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Table, Card, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useGetWeekAppointments } from 'hooks/react-query/useAppointments';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import { useGetEmployments } from 'hooks/react-query/useUsers';
import * as Yup from 'yup';
import { setIsAbleToNext } from 'store/appointments/appointmentsSlice';

export const FirstDataRequestTap = ({ formRef }) => {
  const [serviceDate, setServiceDate] = useState(moment().add(1, 'day').toDate());
  const [serviceId, setServiceId] = useState();
  const [employee, setEmployee] = useState(1);
  
  const { isSuccess, data } = useGetAllServices();
  const { data: weekAppointmentsData, isSuccess: isWeekAppointmentsDataSuccess, refetch } = useGetWeekAppointments({
    serviceDate,
    serviceId,
    employee
  });

  const { data: employmentsData, isSuccess: isEmploymentsDataSuccess } = useGetEmployments();
  const { formatMessage: f, formatDate } = useIntl();
  const dispatch = useDispatch();
  const { selectedAppointments } = useSelector((state) => state.appointments);

  const serviceOptions = useMemo(() =>
  isSuccess ? data.services?.map((service) => {
    return { value: service.service_id, label: service.name };
  }) : [],
[data, isSuccess]);

  const employmentsOptions = useMemo(() =>
    isEmploymentsDataSuccess ? employmentsData.employments.map((employment) => {
      return { value: employment.user_id, label: employment.full_name, image: employment.image };
    }) : [],
  [employmentsData, isEmploymentsDataSuccess]);

  const formatOptionLabel = (values) => {
    console.log('employmentsOptions', `http://localhost:3000/${values.image}`)
  return (
    <div className='formatAppSelect'>
      <img src={`http://localhost:4000/v1/api/${values.image}`} alt='s'/>
      <p className="small-title">{ values.label }</p>
    </div>
  )
};

  const daysOfWeek = useMemo(() => ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], []);

  const daysWithDate = useMemo(() => {
    const selectedDayIndex = serviceDate?.getDay();
    const days = [];
    daysOfWeek.forEach((dayName, index) => {
      const date = new Date(serviceDate);
      date.setDate(serviceDate.getDate() + index - selectedDayIndex);
      days.push({ name: dayName, date });
    });
    return days;
  }, [serviceDate, daysOfWeek]);

  const initialValues = useMemo(() => ({
    employment_id: '',
    service_id: '',
    service_date: '',
    service_time: '',
}), []);


function isBeforeToday(date) {
  const today = moment().add(1, 'day').startOf('day'); // Get today's date without time
  const inputDate = moment(date).startOf('day'); // Get input date without time
  return inputDate.isBefore(today);
}


const onFormSubmit = useCallback(() => {
  console.log('fdsf')
}, []);

useEffect(() => {
  refetch();
}, [employee, serviceDate, serviceId, refetch])



  return (
    <div>
      <Formik
        innerRef={formRef[0]}
        validateOnMount
        initialValues={initialValues}
        onSubmit={onFormSubmit}

      >
      {({ dirty, values, setFieldValue }) => {
        return (
          <Form>
            <h5 className="card-title">{f({ id: 'appointments.FirstTaptitle' })}</h5>
            <p className="card-text text-alternate mb-4">{f({ id: 'appointments.FirstTapDescription' })} </p>

            <Row className="mb-3">
              <Col className="col-12 col-lg-4">
                <Row className="mb-3">
                  <Col className="col-12">
                    <div className="top-label employment-select">
                      <label>Estilista</label>
                      <Select
                        classNamePrefix="react-select"
                        options={employmentsOptions}
                        isSearchable={false}
                        value={employmentsOptions.find((option) => option.value === values.employment_id)}
                        onChange={({ value }) => {
                          setEmployee(value)
                          setFieldValue('employment_id', value)
                        }}
                        placeholder="Seleccione estilista"
                        formatOptionLabel={formatOptionLabel}
                      />
                    </div>
                  </Col>
                </Row>
              
                <Row className="g-1 g-lg-3 mb-3">
                  <Col className="col-6">
                    <div className="top-label">
                    <label className="form-label bg-transparent">Servicio</label>
                      <Select
                        classNamePrefix="react-select"
                        options={serviceOptions}
                        value={serviceOptions.find((option) => option.value === values.service_id)}
                        onChange={({ value }) => {
                          setServiceId(value) 
                          setFieldValue('service_id', value)
                        }}
                        placeholder="Seleccione Servicio"
                        isDisabled={!values.employment_id}
                      />
                    </div>
                  </Col>
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label bg-transparent">Fecha</label>
                      <DatePicker
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        selected={values.service_date}
                        onChange={(date) => {
                          setServiceDate(date);
                          setFieldValue('service_date', date)
                        }}
                        placeholderText="Seleccione el dia"
                        disabled={!values.service_id}
                        minDate={moment().add(1, 'day').toDate()}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            {values.service_date && (
              <>
                <section className="scroll-section">
                  <h2 className="small-title">Citas disponibles</h2>
                  <Card body className="mb-5 appointments-table">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>{f({ id: 'helper.time' })}</th>
                          {daysWithDate.map((day) => (
                            <th
                              key={day.name}
                              className={classNames('table-cell firstchild', { todayCell: moment().startOf('day').isSame(moment(day.date, 'YYYY-MM-DD'), 'day'), selectedCellDate: moment(values.service_date, 'YYYY-MM-DD').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') })}
                            >
                              {
                                moment().startOf('day').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') && (
                                  <h5 className='m-0 text-center'>
                                    Hoy
                                  </h5>
                                )
                              }

                              {
                                moment(values.service_date, 'YYYY-MM-DD').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') && (
                                  <h5 className='m-0 text-center'>
                                    Dia seleccionado
                                  </h5>
                                )
                              }
  
                              <h5 className={`m-0 text-center ${moment().startOf('day').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') || moment(values.service_date, 'YYYY-MM-DD').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') ? 'text-white' : 'text-primary'}`}>
                                {f({ id: `helper.${day.name}` })}
                              </h5>
                              <p className={`m-0 text-center ${moment().startOf('day').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') || moment(values.service_date, 'YYYY-MM-DD').isSame(moment(day.date, 'YYYY-MM-DD'), 'day') ? 'text-white' : 'text-primary'}`}>
                                {formatDate(day.date, { month: 'long', day: 'numeric' })}
                              </p>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isWeekAppointmentsDataSuccess && weekAppointmentsData.timeSlots?.map((timeslot, i) => (
                          <tr key={i}>
                            <td className={classNames('table-cell')}>{moment(timeslot.time, 'HH:mm:ss').format('h:mm A')}</td>
                            {timeslot.appointmentsDates.map(({ isSelected, date}, j) => (
                              <td key={j} className={classNames('table-cell')}>
                                {
                                  ((values.service_time === timeslot.time) && ( moment(values.service_date, 'YYYY-MM-DD').isSame(moment(date, 'YYYY-MM-DD'), 'day') )) ? (
                                    <Button variant="success">Seleccionado</Button>
                                  ) : (
                                    <Button
                                      variant={isSelected ? 'warning' : 'outline-primary'}
                                      onClick={() => {
                                        setFieldValue('service_time', timeslot.time)
                                        setFieldValue('service_date', moment(date, 'YYYY-MM-DD').toDate())
                                        dispatch(setIsAbleToNext(true))
                                      }}
                                      disabled={isSelected || isBeforeToday(date)}
                                    >
                                      {f({ id: isSelected || isSelected || isBeforeToday(date)? 'helper.unavailable' : 'helper.available' })}
                                    </Button>
                                  )
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>
                </section>
              </>
            )}
          </Form>
        )}}
      </Formik>
    </div>
  );
};
