import React, { useMemo } from 'react';
import { Button, Col, Modal, Row, FormCheck } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useServices } from 'hooks/react-query/useServices';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

export const ModalAddEditServices = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const generateMinuteOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ value: i * 5, label: i * 5 })), []);
  // const generateMinuteOptions = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ value: i, label: i })), []);
  const generateHourOptions = useMemo(() => Array.from({ length: 13 }, (_, i) => ({ value: i, label: i })), []);
  const { addServices, updateServices } = useServices(apiParms);

  const initialValues = useMemo(
    () => ({
      service_id: selectedFlatRows?.[0]?.original.service_id || '',
      name: selectedFlatRows?.[0]?.original.name || '',
      duration: selectedFlatRows?.[0]?.original.duration || '',
      price: selectedFlatRows?.[0]?.original.price || '',
      activated: selectedFlatRows?.[0]?.original.activated || '',
    }),
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string()
          .required(f({ id: 'services.serviceNameRequired' }))
          .min(3, f({ id: 'services.serviceNameMinLength' }))
          .max(20, f({ id: 'services.serviceNameMaxLength' })),
        price: Yup.number()
          .required(f({ id: 'services.servicePriceRequired' }))
          .typeError(f({ id: 'services.servicePriceType' }))
          .positive(f({ id: 'services.servicePricePositive' })),
        duration: Yup.string()
          .required(f({ id: 'service.timeErrors.required' }))
          .test('not-zero-point-zero', f({ id: 'service.timeErrors.noValidTime' }), (value) => value && value !== '0.0' && !value.includes('NaN')),
      }),
    [f]
  );

  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      updateServices.mutateAsync(values);
    } else {
      addServices.mutateAsync(values);
    }
    setIsOpenAddEditModal(false);
  };

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ errors, touched, dirty, values, setFieldValue }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>{selectedFlatRows.length === 1 ? f({ id: 'helper.edit' }) : f({ id: 'helper.add' })}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-3 mb-3">
                <Col className="col-3">
                  <div className="d-flex flex-row justify-content-between align-items-center activationSwitch">
                    <label className="form-label">{f({ id: 'services.serviceState' })}</label>
                    <FormCheck className="form-check" type="switch" checked={values.activated} onChange={() => setFieldValue('activated', !values.activated)} />
                  </div>
                </Col>
              </Row>
              <Row className="g-3 mb-3">
                <Col className="col-6">
                  <div className="top-label">
                    <label className="form-label">{f({ id: 'services.serviceName' })}</label>
                    <Field className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} id="name" name="name" />
                    <ErrorMessage className="text-danger" name="name" component="div" />
                  </div>
                </Col>
                <Col className="col-6">
                  <div className="top-label">
                    <label className="form-label">{f({ id: 'services.servicePrice' })}</label>
                    <NumberFormat
                      className={classNames('form-control', { 'is-invalid': errors.price && touched.price })}
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix="₡"
                      allowNegative={false}
                      value={values.price}
                      onValueChange={({ value }) => {
                        setFieldValue('price', value);
                      }}
                    />
                    <ErrorMessage className="text-danger" name="price" component="div" />
                  </div>
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col className="col-6">
                  <div className="top-label">
                    <label>{f({ id: 'service.hours' })}</label>
                    <Select
                      className={classNames(errors.duration && touched.duration && 'is-invalid')}
                      classNamePrefix="react-select"
                      options={generateHourOptions}
                      value={
                        parseInt(values.duration.split('.')[0], 10) >= 0 && {
                          value: parseInt(values.duration.split('.')[0], 10),
                          label: parseInt(values.duration.split('.')[0], 10),
                        }
                      }
                      onChange={({ value }) => setFieldValue('duration', `${value}.${parseInt(values.duration.split('.')[1], 10)}`)}
                      placeholder={f({ id: 'service.selectHours' })}
                    />
                  </div>
                  {errors.duration && touched.duration && <ErrorMessage className="text-danger" name="duration" component="div" />}
                </Col>
                <Col className="col-6">
                  <div className="top-label">
                    <label>{f({ id: 'service.minutes' })}</label>
                    <Select
                      className={classNames(errors.duration && touched.duration && 'is-invalid')}
                      classNamePrefix="react-select"
                      options={generateMinuteOptions}
                      value={
                        parseInt(values.duration.split('.')[1], 10) >= 0 && {
                          value: parseInt(values.duration.split('.')[1], 10),
                          label: parseInt(values.duration.split('.')[1], 10),
                        }
                      }
                      onChange={({ value }) => setFieldValue('duration', `${parseInt(values.duration.split('.')[0], 10)}.${value}`)}
                      placeholder={f({ id: 'service.selectMinutes' })}
                    />
                  </div>
                  {errors.duration && touched.duration && <ErrorMessage className="text-danger" name="duration" component="div" />}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
                {f({ id: 'helper.cancel' })}
              </Button>
              <Button variant="primary" type="submit" disabled={selectedFlatRows.length === 1 && !dirty && true}>
                {selectedFlatRows.length === 1 ? f({ id: 'helper.done' }) : f({ id: 'helper.add' })}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
