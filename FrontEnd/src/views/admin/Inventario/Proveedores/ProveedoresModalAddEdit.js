import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useProviders } from 'hooks/react-query/useProviders';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';

export const ProveedoresModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateProvider, addProvider } = useProviders(apiParms);

  const onSubmit = useCallback(
    (values) => {
      if (selectedFlatRows.length === 1) {
        updateProvider.mutateAsync(values);
      } else {
        addProvider.mutateAsync(values);
      }
      setIsOpenAddEditModal(false);
    },
    [setIsOpenAddEditModal, selectedFlatRows, updateProvider, addProvider]
  );

  const initialValues = useMemo(
    () => ({
      provider_id: selectedFlatRows?.[0]?.original.provider_id || '',
      name: selectedFlatRows?.[0]?.original.name || '',
      email: selectedFlatRows?.[0]?.original.email || '',
      phone: selectedFlatRows?.[0]?.original.phone || '',
    }),
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string()
          .required(f({ id: 'helper.nameRequired' }))
          .min(3, f({ id: 'helper.nameMinLength' }))
          .max(20, f({ id: 'helper.nameMaxLength' })),
        email: Yup.string()
          .email(f({ id: 'helper.emailInvalid' }))
          .required(f({ id: 'helper.emailRequired' })),
        phone: Yup.string()
          .matches(/^\d+$/, f({ id: 'helper.phoneOnlyNumbers' }))
          .min(8, f({ id: 'helper.phoneMinLength' }))
          .max(10, f({ id: 'helper.phoneMaxLength' }))
          .required(f({ id: 'helper.phoneRequired' })),
      }),
    [f]
  );

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty, values, setFieldValue }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="g-3 mb-3">
                  <Col>
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.name' })}</label>
                      <Field className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} id="name" name="name" />
                      <ErrorMessage className="text-danger" name="name" component="div" />
                    </div>
                  </Col>
                </Row>
                <Row className="g-3 mb-3">
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.email' })}</label>
                      <Field className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} id="email" name="email" />
                      <ErrorMessage className="text-danger" name="email" component="div" />
                    </div>
                  </Col>
                  <Col className="col-6 top-label">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.phone' })}</label>
                      <NumberFormat
                        className={classNames('form-control', { 'is-invalid': errors.phone && touched.phone })}
                        mask="_"
                        format="####-####"
                        allowEmptyFormatting
                        value={values.phone}
                        onValueChange={({ value }) => {
                          setFieldValue('phone', value);
                        }}
                      />
                      <ErrorMessage className="text-danger" name="phone" component="div" />
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
                  {f({ id: 'helper.cancel' })}
                </Button>
                <Button variant="primary" type="submit" disabled={selectedFlatRows.length === 1 && !dirty && true}>
                  {selectedFlatRows.length === 1 ? f({ id: 'helper.edit' }) : f({ id: 'helper.add' })}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Card>
    </Modal>
  );
};
