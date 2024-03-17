import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import moment from 'moment';
import { useAddAppointment, useUpdateAppointment } from 'hooks/react-query/useAppointments';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { DatepickerField } from 'components/DatepickerField';
import { SelectField } from 'components/SelectField'; 


const ModalAddEdit = ({ show = false, onHide = () => {} }) => {
  const { formatMessage: f } = useIntl();
  const updateAppointment = useUpdateAppointment();
  const addAppointment = useAddAppointment();
  const { data, isSuccess: isServicesSuccess } = useGetAllServices();
  const services = useMemo(() => data?.services?.map((service) => { return { value: service.service_id, label: service.name }}), [data]);

  const [isShowDeleteConfirmModal, setIsShowDeleteConfirmModal] = useState(false);
  const convertStringToDate = (dateStr, key) => {
    const date = dateStr && typeof dateStr === 'string' ? new Date(dateStr) : new Date();
    return { [`${key}Date`]: date, [`${key}Time`]: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` };
  };

  const convertDateToString = (date, time) => {
    return `${(typeof date === 'string' ? new Date(date) : date).toISOString().replace(/T.*$/, '')}T${time}:00`;
  };
  const { selectedEvent } = useSelector((state) => state.calendar);
  const selectedItem = useMemo(() => {
    if (selectedEvent.start && selectedEvent.start) {
      return {
        ...selectedEvent,
        ...convertStringToDate(selectedEvent.start, 'start'),
        ...convertStringToDate(selectedEvent.end, 'end'),
      };
    }
    return selectedEvent;
  }, [selectedEvent])
  
  const timeOptions = React.useMemo(() => {
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
  
  const deleteItem = () => {
    setIsShowDeleteConfirmModal(true);
  };

  const onSubmit = useCallback(({ serviceDate, startTime, endTime, service, extraDescription, extra }) => {
    console.log('startTime', startTime)
    if (selectedItem.id !== 0) {
      const itemSubmit = {
        id: selectedItem.id,
        title: selectedItem.title,
        start: convertDateToString(serviceDate, moment(startTime.value, 'hh:mm A').format('HH:mm')),
        end: convertDateToString(serviceDate, moment(endTime.value, 'hh:mm A').format('HH:mm')),
        service_price: selectedItem.service_price,
        service_id: service,
        service_appointment_id: selectedItem.service_appointment_id,
        extra_description: extraDescription,
        extra
      }
      updateAppointment.mutateAsync(itemSubmit);
    } else {
      const itemSubmit = {
        title: selectedItem.title,
        start: convertDateToString(serviceDate, moment(startTime.value, 'hh:mm A').format('HH:mm')),
        end: convertDateToString(serviceDate, moment(endTime.value, 'hh:mm A').format('HH:mm')),
        service_id: service,
        extra_description: extraDescription,
        extra,
        service_price: data?.services?.find((x) => x.service_id === 5).price,
      }
      addAppointment.mutateAsync(itemSubmit);
    }
    onHide();
  }, [selectedItem]);
  const validationSchema = Yup.object().shape({
    extra: Yup.number().required(f({ id: 'appointments.extraErrorRequired' })).typeError(f({ id: 'appointments.extraErrorBeNumber' })),
    extraDescription: Yup.string().required(f({ id: 'appointments.extraDescriptionRequired' })).min(3, f({ id: 'appointments.extraDescriptionMinLength' })).max(200, f({ id: 'appointments.extraDescriptionMaxLength' })),
    service: Yup.string().required(f({ id: 'appointments.serviceErrorRequired' })),
    startTime: Yup.string().required(f({ id: 'appointments.startTimeErrorRequired' })),
    endTime: Yup.string().required(f({ id: 'appointments.endTimeErrorRequired' })),
  });

  const initialValues = useMemo(() => {
    return {
      title: selectedItem ? selectedItem.title : '',
      service: selectedItem ? selectedItem.service_id : 0,
      service_price:  parseFloat(selectedItem ? selectedItem.service_price: 0 ).toLocaleString('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      startTime: selectedItem && moment(selectedItem.startTime, 'HH:mm').format('hh:mm A'),
      endTime: selectedItem ? moment(selectedItem.endTime, 'HH:mm').format('hh:mm A') : '',
      serviceDate: selectedItem ? selectedItem.startDate : null,
      extra: selectedItem ? selectedItem.extra : '',
      extraDescription: selectedItem ? selectedItem.extra_description : ''
    }
  }, [selectedItem, services]);
  
  console.log('timeOptions', selectedItem)

  return (
    <>
      <Modal className="modal-right fade" show={show} onHide={onHide}>
        {
          isServicesSuccess && (
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form>
                <Modal.Header>
                  <Modal.Title>{selectedEvent.id !== 0 ? 'Edit Event' : 'Add Event'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column">
                  <div className="mb-3 top-label">
                    <label className="form-label">Title</label>
                    <Field className="form-control" type="text" id="title" name="title" />
                    <ErrorMessage name="salary" component="div" />
                  </div>
                  <SelectField
                    label={f({ id: 'appointments.service' })}
                    name="service"
                    options={services}
                  />
                  {/* <div className="mb-3 top-label">
                    <label className="form-label">Title</label>
                    <Field className="form-control" type="text" id="service_price" name="service_price" disabled/>
                    <ErrorMessage name="service_price" component="div" />
                  </div> */}
                  <Row className="g-0 mb-3">
                    <DatepickerField
                      label={f({ id: 'appointments.appointmentDate' })}
                      name="serviceDate"
                      showFullMonthYearPicker
                    />
                  </Row>
                  <Row className="g-3">
                    <Col>
                      <SelectField
                        label={f({ id: 'appointments.startTime' })}
                        name="startTime"
                        options={timeOptions}
                      />
                    </Col>
                    <Col>
                      <SelectField
                        label={f({ id: 'appointments.endTime' })}
                        name="endTime"
                        options={timeOptions}
                      />
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <div className="mb-3 top-label">
                      <label className="form-label">{ f({ id: 'appointments.extra' }) }</label>
                      <Field className="form-control" type="text" id="extra" name="extra"/>
                      <ErrorMessage className='text-danger' name='extra' component="div" />
                    </div>
                  </Row>
                  <Row className="g-0">
                    <div className="mb-3 top-label">
                      <label className="form-label">{ f({ id: 'appointments.extraDescription' }) }</label>
                      <Field as="textarea" className="form-control" type="text" id="extraDescription" name="extraDescription"/>
                      <ErrorMessage className='text-danger' name='extraDescription' component="div" />
                    </div>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  {selectedEvent.id !== 0 ? (
                    <>
                      <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>{ f({ id: 'appointments.deleteAppointment' }) }</Tooltip>} placement="top">
                        <Button variant="outline-primary" className="btn-icon btn-icon-only" onClick={deleteItem}>
                          <CsLineIcons icon="bin" />
                        </Button>
                      </OverlayTrigger>

                      <Button className="btn-icon btn-icon-end" type='submit'>
                        <span>{ f({ id: 'appointments.saveAppointment' }) }</span> <CsLineIcons icon="check" />
                      </Button>
                    </>
                  ) : (
                    <Button className="btn-icon btn-icon-start" type='submit'>
                      <CsLineIcons icon="plus" /> <span>{ f({ id: 'appointments.addAppointment' }) }</span>
                    </Button>
                  )}
                </Modal.Footer>
              </Form>
            </Formik>
          )
        }
      </Modal>

          {/* <Modal className="fade modal-close-out" show={isShowDeleteConfirmModal}>
            <Modal.Header>
              <Modal.Title> Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column">
              <p>
                <span className="fw-bold">{selectedItem.title}</span> <span>will be deleted. Are you sure?</span>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setIsShowDeleteConfirmModal(false)}>No</Button>
              <Button variant="outline-primary" onClick={deleteItemApprove}>
                Yes
              </Button>
            </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default ModalAddEdit;
