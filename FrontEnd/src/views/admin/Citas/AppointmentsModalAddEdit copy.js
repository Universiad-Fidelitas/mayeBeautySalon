import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { SelectField } from 'components/SelectField';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { DatepickerField } from 'components/DatepickerField';
import 'react-datepicker/dist/react-datepicker.css';

export const AppointmentsModalAddEdit = ({ isOpenAddEditModal, setIsOpenAddEditModal }) => {
    const { formatMessage: f } = useIntl();
    const { selectedEvent } = useSelector((state) => state.calendar);

    
    const { data: servicesData, isSuccess: isServicesDataSuccess } = useGetAllServices();
    const servicesOptions = useMemo(() => isServicesDataSuccess ? servicesData.services.map(({ service_id, name }) => {
      return { value: service_id, label: name };
    }) : [],[servicesData, isServicesDataSuccess]);

    const onSubmit = useCallback((values) => {
        console.log('onSubmit', values)
      setIsOpenAddEditModal(false);
    }, []);

    const initialValues = useMemo(() => ({
        service_id: selectedEvent?.service_id || '',
        service_date: moment(selectedEvent.start ? selectedEvent.start : selectedEvent.startDate).toDate() || new Date(),
        start_time: moment(selectedEvent?.start).format('hh:mm A') || ''
    }), [selectedEvent]);

    console.log('initialValuesMAUUU', moment(selectedEvent?.start,).format('YYYY-MM-DD'))

    const validationSchema = useMemo(() => Yup.object().shape({
        service_id: Yup.string().required(f({ id: 'appointments.serviceErrorRequired' })),
        start_time: Yup.string().required(f({ id: 'appointments.startTimeErrorRequired' })),
    }), [f]);

    const timeOptions = useMemo(() => {
        const options = [];
        for (let h = 6; h <= 18; h += 1) {
          ['00', '15', '30', '45'].forEach((m) => {
            const hour12 = h > 12 ? h - 12 : h;
            const period = h >= 12 ? 'PM' : 'AM';
            const time = `${hour12.toString().padStart(2, '0')}:${m} ${period}`;
            options.push({ value: time, label: time });
          });
        }
        return options;
      }, []);

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty, values, setFieldValue }) => {
            console.log('AppointmentsModalAddEdit', values, selectedEvent.service_id)
            return (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedEvent.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Row className="mb-3">
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label bg-transparent">Fecha</label>
                      <DatePicker
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        selected={values.service_date}
                        onChange={(date) => {
                          setFieldValue('service_date', date)
                        }}
                        placeholderText="Seleccione el dia"
                        minDate={moment().add(1, 'day').toDate()}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3">
                    <Col className="col-8">
                        <SelectField
                            label="Servicio"
                            name="service_id"
                            placeholder="Seleccionar Servicio"
                            options={servicesOptions}
                            isError={errors.service_id && touched.service_id}
                        />
                    </Col>
                    <Col className="col-4">
                        <div className="top-label">
                            <label className="form-label bg-transparent">Precio</label>
                            <NumberFormat
                                className="form-control"
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="₡"
                                allowNegative={false}
                                value={values.service_id ? servicesData.services?.find((x) => x.service_id === values.service_id).price : 0}
                                disabled
                            />
                      </div>
                    </Col>
                </Row>

                <Row className="g-3">
                    <Col className="col-6">
                        <SelectField
                            label={f({ id: 'appointments.startTime' })}
                            name="start_time"
                            placeholder="Seleccionar Hora de Inicio"
                            options={timeOptions}
                            isError={errors.start_time && touched.start_time}
                        />
                    </Col>
                  <Col>
                    <SelectField label={f({ id: 'appointments.endTime' })} name="endTime" options={timeOptions} />
                  </Col>
                </Row>





                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
                  {f({ id: 'helper.cancel' })}
                </Button>
                <Button variant="primary" type="submit" disabled={selectedEvent.length === 1 && !dirty && true}>
                  {selectedEvent.length === 1 ? f({ id: 'helper.edit' }) : f({ id: 'helper.add' })}
                </Button>
              </Modal.Footer>
            </Form>
          )}}
        </Formik>
      </Card>
    </Modal>
  )
}
