import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { SelectField } from 'components/SelectField';
import { useProducts } from 'hooks/react-query/useProducts';
import { useNotifications } from 'hooks/react-query/useNotificacions';

export const NotificacionsModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateNotification, addNotification } = useNotifications(apiParms);

  const { data: productsData } = useProducts();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name }) => {
        return { value: product_id, label: name };
      }),
    [productsData]
  );

  const onSubmit = useCallback(
    (values) => {
      if (selectedFlatRows.length === 1) {
        updateNotification.mutateAsync(values);
      } else {
        addNotification.mutateAsync(values);
      }
      setIsOpenAddEditModal(false);
    },
    [setIsOpenAddEditModal, selectedFlatRows, updateNotification, addNotification]
  );

  const initialValues = useMemo(
    () => ({
      notification_id: selectedFlatRows?.[0]?.original.notification_id || '',
      amount: selectedFlatRows?.[0]?.original.amount || '',
      product_id: selectedFlatRows?.[0]?.original.product_id || '',
    }),
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        amount: Yup.number()
          .min(1, f({ id: 'notifications.amountErrors.minLength' }))
          .max(999, f({ id: 'notifications.amountErrors.maxLength' }))
          .required(f({ id: 'notifications.amountErrors.required' })),
        product_id: Yup.string().required(f({ id: 'notifications.productErrors.required' })),
      }),
    [f]
  );

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="g-3 mb-3">
                  <Col>
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'notifications.productsMinAmount' })}</label>
                      <Field className={`form-control ${errors.amount && touched.amount ? 'is-invalid' : ''}`} id="amount" name="amount" />
                      <ErrorMessage className="text-danger" name="amount" component="div" />
                    </div>
                  </Col>
                </Row>
                <Row className="g-3 mb-3">
                  <Col className="col-12 top-label">
                    <SelectField
                      label={f({ id: 'notifications.productsList' })}
                      name="product_id"
                      placeholder={f({ id: 'notifications.selectProduct' })}
                      options={productsDataDropdown}
                      isError={errors.product_id && touched.product_id}
                    />
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
