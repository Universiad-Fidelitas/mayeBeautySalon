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
import NumberFormat from 'react-number-format';
import classNames from 'classnames';
import { useUserPermissions } from 'hooks/useUserPermissions';

export const AppointmentsModalAddEdit = ({ isOpenAddEditModal, setIsOpenAddEditModal }) => {
  const { formatMessage: f } = useIntl();
  const updateAppointment = useUpdateAppointment();
  const addAppointment = useAddAppointment();
  const deleteAppointment = useDeleteAppointment();
  const { data: usersData, isSuccess: isAppointmentUsersSuccess } = useGetAppointmentUsers();
  const { data: employmentsData, isSuccess: isEmploymentsDataSuccess } = useGetEmployments();
  const { selectedEvent } = useSelector((state) => state.calendar);
  const { userHasPermission } = useUserPermissions();
  console.log('test delete', userHasPermission('D_APPOINTMENTS'));
  const employmentsOptions = useMemo(
    () =>
      isEmploymentsDataSuccess
        ? employmentsData.employments.map((employment) => {
            return { value: employment.user_id, label: employment.full_name, image: employment.image };
          })
        : [],
    [employmentsData, isEmploymentsDataSuccess]
  );

  const { data: servicesData, isSuccess: isServicesDataSuccess } = useGetAllServices();
  const servicesOptions = useMemo(
    () =>
      isServicesDataSuccess
        ? servicesData.services.map(({ service_id, name }) => {
            return { value: service_id, label: name };
          })
        : [],
    [servicesData, isServicesDataSuccess]
  );

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
    for (let h = 9; h <= 20; h += 1) {
      ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].forEach((m) => {
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
    ({ serviceDate, startTime, endTime, service_id, extraDescription, extra, activeUser, employee }) => {
      if (selectedItem.id !== 0) {
        const itemSubmit = {
          id: selectedItem.id,
          title: services.find((x) => x.value === service_id).label,
          start: convertDateToString(serviceDate, moment(startTime, 'hh:mm A').format('HH:mm')),
          end: convertDateToString(serviceDate, moment(endTime, 'hh:mm A').format('HH:mm')),
          service_id,
          service_appointment_id: selectedItem.service_appointment_id,
          extra_description: extraDescription?.length > 0 ? extraDescription : '',
          extra: extra?.toString().length > 0 ? extra : 0,
          user_id: activeUser,
          employee,
        };
        updateAppointment.mutateAsync(itemSubmit);
      } else {
        const itemSubmit = {
          title: services.find((x) => x.value === service_id).label,
          start: `${moment(serviceDate).format('YYYY-MM-DD')}T${moment(startTime, 'hh:mm A').format('HH:mm')}`,
          end: `${moment(serviceDate).format('YYYY-MM-DD')}T${moment(endTime, 'hh:mm A').format('HH:mm')}`,
          service_id,
          extra_description: extraDescription?.length > 0 ? extraDescription : '',
          extra: extra?.toString().length > 0 ? extra : 0,
          user_id: activeUser,
          employee,
        };
        addAppointment.mutateAsync(itemSubmit);
      }
      setIsOpenAddEditModal(false);
    },
    [selectedItem, services, updateAppointment, addAppointment, setIsOpenAddEditModal]
  );
  const validationSchema = Yup.object().shape({
    extra: Yup.number()
      .typeError(f({ id: 'appointments.extraErrorBeNumber' }))
      .min(0, f({ id: 'appointments.extraErrorBeNumber' })),
    extraDescription: Yup.string()
      .min(3, f({ id: 'appointments.extraDescriptionMinLength' }))
      .max(200, f({ id: 'appointments.extraDescriptionMaxLength' })),
    service_id: Yup.string().required(f({ id: 'appointments.serviceErrorRequired' })),
    startTime: Yup.string().required(f({ id: 'appointments.startTimeErrorRequired' })),
    activeUser: Yup.string().required(f({ id: 'appointments.customerErrorRequired' })),
    employee: Yup.string().required('Empleado es requerido'),
    endTime: Yup.string()
      .required(f({ id: 'appointments.endTimeErrorRequired' }))
      .test('is-greater', f({ id: 'appointments.errorEndTime' }), (value, context) => {
        const { startTime } = context.parent;
        if (!startTime || !value) {
          return true;
        }
        const startTimeMoment = moment(startTime, 'h:mm A');
        const endTimeMoment = moment(value, 'h:mm A');
        return endTimeMoment.isAfter(startTimeMoment);
      }),
  });

  const initialValues = useMemo(() => {
    return {
      service_id: selectedEvent?.service_id || '',
      startTime: selectedItem.startTime && moment(selectedItem.startTime, 'HH:mm').format('hh:mm A'),
      endTime: selectedItem.endTime && moment(selectedItem.endTime, 'HH:mm').format('hh:mm A'),
      serviceDate: selectedItem.startDate ? selectedItem.startDate : moment().add(1, 'day').toDate(),
      extra: selectedItem?.extra !== 0 ? selectedItem.extra : '',
      extraDescription: selectedItem.extra_description ? selectedItem.extra_description : '',
      email: selectedItem.email ? selectedItem.email : '',
      phone: selectedItem.phone ? selectedItem.phone : '',
      activeUser: selectedEvent?.user_id || '',
      employee: selectedEvent?.employee_id || selectedEvent?.employee || '',
    };
  }, [selectedItem]);
  console.log('iv', initialValues);
  const deleteItemApprove = useCallback(() => {
    setIsShowDeleteConfirmModal(false);
    setIsOpenAddEditModal(false);
    deleteAppointment.mutateAsync(selectedItem);
  }, [deleteAppointment, selectedItem, setIsOpenAddEditModal, setIsShowDeleteConfirmModal]);

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
        <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ errors, touched, dirty, values, setFieldValue }) => (
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
                          thousandSeparator=","
                          decimalSeparator="."
                          prefix="₡"
                          allowNegative={false}
                          value={values.service_id ? servicesData.services?.find((x) => x.service_id === values.service_id).price : 0}
                          disabled
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="g-3">
                    <Col>
                      <SelectField
                        label={f({ id: 'appointments.startTime' })}
                        name="startTime"
                        options={timeOptions}
                        isError={errors.startTime && touched.startTime}
                      />
                    </Col>
                    <Col>
                      <SelectField label={f({ id: 'appointments.endTime' })} name="endTime" options={timeOptions} isError={errors.endTime && touched.endTime} />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-12">
                      <SelectField label="Empleado" name="employee" options={employmentsOptions} isError={errors.employee && touched.employee} />
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <div className="mb-3 top-label">
                      <label className="form-label">{f({ id: 'appointments.extra' })}</label>
                      <NumberFormat
                        className={classNames('form-control', { 'is-invalid': errors.extra && touched.extra })}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="₡"
                        allowNegative={false}
                        value={values.extra}
                        onValueChange={({ value }) => {
                          setFieldValue('extra', value);
                        }}
                      />
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
                  <SelectField
                    label={f({ id: 'appointments.service' })}
                    name="activeUser"
                    options={activeUsers}
                    isError={errors.activeUser && touched.activeUser}
                  />
                  <UserInformationField />
                </Modal.Body>
                <Modal.Footer>
                  {selectedEvent.id !== 0 ? (
                    <>
                      <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>{f({ id: 'appointments.deleteAppointment' })}</Tooltip>} placement="top">
                        {userHasPermission && userHasPermission('D_APPOINTMENTS') && (
                          <Button variant="outline-primary" className="btn-icon btn-icon-only" onClick={deleteItem}>
                            <CsLineIcons icon="bin" />
                          </Button>
                        )}
                      </OverlayTrigger>

                      <Button disabled={!dirty} className="btn-icon btn-icon-end" type="submit">
                        <span>{f({ id: 'appointments.saveAppointment' })}</span> <CsLineIcons icon="check" />
                      </Button>
                    </>
                  ) : (
                    <Button disabled={!dirty} className="btn-icon btn-icon-start" type="submit">
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
            <Modal.Title>¿Estas seguro?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column">
            <p>
              <span>La cita será eliminada ¿Estas seguro?</span>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setIsShowDeleteConfirmModal(false)}>No</Button>
            <Button variant="outline-primary" onClick={deleteItemApprove}>
              Si
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  return <p>cargando</p>;
};
