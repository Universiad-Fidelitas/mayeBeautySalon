import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import moment from 'moment';
import { useAddAppointment, useDeleteAppointment, useGetAppointmentUsers, useUpdateAppointment } from 'hooks/react-query/useAppointments';
import { useGetAllServices } from 'hooks/react-query/useServices';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { DatepickerField } from 'components/DatepickerField';
import { SelectField } from 'components/SelectField';
import { useGetEmployments } from 'hooks/react-query/useUsers';

const ModalAddEdit = ({ show = false, onHide = () => {} }) => {
  const { formatMessage: f } = useIntl();
  const updateAppointment = useUpdateAppointment();
  const addAppointment = useAddAppointment();
  const deleteAppointment = useDeleteAppointment();
  const { data: usersData, isSuccess: isAppointmentUsersSuccess } = useGetAppointmentUsers();
  const { data: employmentsData, isSuccess: isEmploymentsDataSuccess } = useGetEmployments();
  const { selectedEvent } = useSelector((state) => state.calendar);

  const employmentsOptions = useMemo(() =>
  isEmploymentsDataSuccess ? employmentsData.employments.map((employment) => {
    return { value: employment.user_id, label: employment.full_name, image: employment.image };
  }) : [],
[employmentsData, isEmploymentsDataSuccess]);

  const { data, isSuccess: isServicesSuccess } = useGetAllServices();
  const services = useMemo(
    () =>
      data?.services?.map((service) => {
        return { value: service.service_id, label: service.name };
      }),
    [data]
  );
  const activeUsers = useMemo(
    () =>
      usersData?.activeUsers.map((activeUser) => {
        return { value: activeUser.user_id, label: `${activeUser.first_name} ${activeUser.last_name}` };
      }),
    [usersData]
  );

  const [isShowDeleteConfirmModal, setIsShowDeleteConfirmModal] = useState(false);
  const convertStringToDate = (dateStr, key) => {
    const date = dateStr && typeof dateStr === 'string' ? new Date(dateStr) : new Date();
    return { [`${key}Date`]: date, [`${key}Time`]: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` };
  };

  const convertDateToString = (date, time) => {
    return `${(typeof date === 'string' ? new Date(date) : date).toISOString().replace(/T.*$/, '')}T${time}:00`;
  };

  const selectedItem = useMemo(() => {
    if (selectedEvent.start && selectedEvent.end) {
      return {
        ...selectedEvent,
        ...convertStringToDate(selectedEvent.start, 'start'),
        ...convertStringToDate(selectedEvent.end, 'end'),
      };
    }
    return selectedEvent;
  }, [selectedEvent]);

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

  const onSubmit = useCallback(
    ({ serviceDate, startTime, endTime, service, extraDescription, extra, activeUser }) => {
      if (selectedItem.id !== 0) {
        const itemSubmit = {
          id: selectedItem.id,
          title: services.find((x) => x.value === service).label,
          start: convertDateToString(serviceDate, moment(startTime, 'hh:mm A').format('HH:mm')),
          end: convertDateToString(serviceDate, moment(endTime, 'hh:mm A').format('HH:mm')),
          service_id: service,
          service_appointment_id: selectedItem.service_appointment_id,
          extra_description: extraDescription?.length > 0 ? extraDescription : '',
          extra: extra?.toString().length > 0 ? extra : 0,
          user_id: activeUser,
        };
        updateAppointment.mutateAsync(itemSubmit);
      } else {
        const itemSubmit = {
          title: services.find((x) => x.value === service).label,
          start: convertDateToString(serviceDate, moment(startTime, 'hh:mm A').format('HH:mm')),
          end: convertDateToString(serviceDate, moment(endTime, 'hh:mm A').format('HH:mm')),
          service_id: service,
          extra_description: extraDescription?.length > 0 ? extraDescription : '',
          extra: extra?.toString().length > 0 ? extra : 0,
          user_id: activeUser,
        };
        addAppointment.mutateAsync(itemSubmit);
      }
      onHide();
    },
    [selectedItem, services, updateAppointment, addAppointment, onHide]
  );
  const validationSchema = Yup.object().shape({
    extra: Yup.number()
      .typeError(f({ id: 'appointments.extraErrorBeNumber' }))
      .min(0, f({ id: 'appointments.extraErrorBeNumber' })),
    extraDescription: Yup.string()
      .min(3, f({ id: 'appointments.extraDescriptionMinLength' }))
      .max(200, f({ id: 'appointments.extraDescriptionMaxLength' })),
    service: Yup.string().required(f({ id: 'appointments.serviceErrorRequired' })),
    startTime: Yup.string().required(f({ id: 'appointments.startTimeErrorRequired' })),
    activeUser: Yup.string().required(f({ id: 'appointments.customerErrorRequired' })),
    employee: Yup.string().required('Empleado es requerido'),
    // endTime: Yup.string()
    //   .required(f({ id: 'appointments.endTimeErrorRequired' }))
    //   .test('is-greater', f({ id: 'appointments.errorEndTime' }), (value, context) => {
    //     const { startTime } = context.parent;
    //     if (!startTime || !value) {
    //       return true;
    //     }
    //     const startTimeMoment = moment(startTime, 'h:mm A');
    //     const endTimeMoment = moment(value, 'h:mm A');
    //     return endTimeMoment.isAfter(startTimeMoment);
    //   }),
  });

  const initialValues = useMemo(() => {
    return {
      service: selectedItem.service_id ? selectedItem.service_id : 0,
      startTime: selectedItem.startTime && moment(selectedItem.startTime, 'HH:mm').format('hh:mm A'),
      endTime: selectedItem.endTime && moment(selectedItem.endTime, 'HH:mm').format('hh:mm A'),
      serviceDate: selectedItem.startDate ? selectedItem.startDate : new Date(),
      extra: selectedItem?.extra !== 0 ? selectedItem.extra : '',
      extraDescription: selectedItem.extra_description ? selectedItem.extra_description : '',
      email: selectedItem.email ? selectedItem.email : '',
      phone: selectedItem.phone ? selectedItem.phone : '',
      activeUser: selectedItem.user_id ? selectedItem.user_id : 0,
      employee: selectedItem.employee_id ? selectedItem.employee_id : 0,
    };
  }, [selectedItem]);

  const ServicePriceField = () => {
    const { values } = useFormikContext();
    const servicePrice = useMemo(() => {
      return parseFloat(values.service ? data?.services?.find((x) => x.service_id === values.service).price : 0).toLocaleString('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [values]);
    return (
      <div className="mb-3 top-label">
        <label className="form-label bg-transparent">{f({ id: 'appointments.servicePrice' })}</label>
        <input className="form-control" value={servicePrice} disabled />
      </div>
    );
  };

  const deleteItemApprove = useCallback(() => {
    setIsShowDeleteConfirmModal(false);
    onHide();
    deleteAppointment.mutateAsync(selectedItem);
  }, [deleteAppointment, selectedItem, onHide, setIsShowDeleteConfirmModal]);

  const UserInformationField = () => {
    const { values } = useFormikContext();
    const selectedUser = usersData?.activeUsers?.find((x) => x.user_id === values.activeUser);
    return (
      <>
        <div className="mb-3 top-label">
          <label className="form-label bg-transparent">{f({ id: 'appointments.customerName' })}</label>
          <input className="form-control" value={`${selectedUser ? selectedUser.first_name : ''} ${selectedUser ? selectedUser.last_name : ''}`} disabled />
        </div>
        <div className="mb-3 top-label">
          <label className="form-label bg-transparent">{f({ id: 'appointments.emailInformation' })}</label>
          <input className="form-control" value={selectedUser ? selectedUser.email : ''} disabled />
        </div>
        <div className="mb-3 top-label">
          <label className="form-label bg-transparent">{f({ id: 'appointments.phoneNumber' })}</label>
          <input className="form-control" value={selectedUser ? selectedUser.phone : ''} disabled />
        </div>
      </>
    );
  };

  if (isServicesSuccess && isAppointmentUsersSuccess) {
    return (
      <>
        <Modal className="modal-right fade" show={show} onHide={onHide}>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedEvent.id !== 0 ? f({ id: 'appointments.editAppointment' }) : f({ id: 'appointments.addAppointment' })}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex flex-column">
                <Row className="g-0">
                  <DatepickerField label={f({ id: 'appointments.appointmentDate' })} name="serviceDate" showFullMonthYearPicker />
                </Row>
                <Row className="g-3">
                  <Col className="col-8">
                    <SelectField label={f({ id: 'appointments.service' })} name="service" options={services} />
                  </Col>
                  <Col className="col-4">
                    {/* <ServicePriceField /> */}
                  </Col>
                </Row>
                
                <Row className="g-3">
                  <Col>
                    <SelectField label={f({ id: 'appointments.startTime' })} name="startTime" options={timeOptions} />
                  </Col>
                  <Col>
                    <SelectField label={f({ id: 'appointments.endTime' })} name="endTime" options={timeOptions} />
                  </Col>
                </Row>
                <Row>
                  <Col className="col-12">
                    <SelectField label="Empleado" name="employee" options={employmentsOptions} />
                  </Col>
                </Row>
                <Row className="g-0">
                  <div className="mb-3 top-label">
                    <label className="form-label">{f({ id: 'appointments.extra' })}</label>
                    <Field className="form-control" type="text" id="extra" name="extra" />
                    <ErrorMessage className="text-danger" name="extra" component="div" />
                  </div>
                </Row>
                <Row className="g-0 mb-2">
                  <div className="top-label">
                    <label className="form-label">{f({ id: 'appointments.extraDescription' })}</label>
                    <Field as="textarea" className="form-control" type="text" id="extraDescription" name="extraDescription" />
                    <ErrorMessage className="text-danger" name="extraDescription" component="div" />
                  </div>
                </Row>
                <hr />
                <h4 className="mb-3">{f({ id: 'appointments.customerInformation' })}</h4>
                <SelectField label={f({ id: 'appointments.service' })} name="activeUser" options={activeUsers} />
                <UserInformationField />
              </Modal.Body>
              <Modal.Footer>
                {selectedEvent.id !== 0 ? (
                  <>
                    <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>{f({ id: 'appointments.deleteAppointment' })}</Tooltip>} placement="top">
                      <Button variant="outline-primary" className="btn-icon btn-icon-only" onClick={deleteItem}>
                        <CsLineIcons icon="bin" />
                      </Button>
                    </OverlayTrigger>

                    <Button disabled={selectedEvent.length === 1 && !dirty && true} className="btn-icon btn-icon-end" type="submit">
                      <span>{f({ id: 'appointments.saveAppointment' })}</span> <CsLineIcons icon="check" />
                    </Button>
                  </>
                ) : (
                  <Button disabled={selectedEvent.length === 1 && dirty} className="btn-icon btn-icon-start" type="submit">
                    <CsLineIcons icon="plus" /> <span>{f({ id: 'appointments.addAppointment' })}</span>
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          )}
          </Formik>
        </Modal>

        <Modal className="fade modal-close-out" show={isShowDeleteConfirmModal}>
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
        </Modal>
      </>
    );
  }
  return <p>cargando</p>;
};

export default ModalAddEdit;
