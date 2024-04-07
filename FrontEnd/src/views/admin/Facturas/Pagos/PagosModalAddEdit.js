import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { SelectField } from 'components/SelectField';
import { UploaderComponent } from 'components/imagesUploader/UploaderComponent2';
import { usePayments } from 'hooks/react-query/usePayments';
import classNames from 'classnames';
import Select from 'react-select';
import NumberFormat from 'react-number-format';

export const PagosModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { addPayment, updatePayment } = usePayments(apiParms);

  const onSubmit = useCallback(
    (values) => {
      console.log(values);
      const formData = new FormData();
      const userSchema = {
        ...values,
      };
      if (values.voucher_path !== '') {
        if (values.voucher_path[0].file) {
          Object.entries(userSchema).forEach(([key, value]) => {
            if (key !== 'voucher_path') {
              formData.append(key, value);
            }
          });

          formData.append('voucher_path', values.voucher_path[0].file);
        } else {
          Object.entries(userSchema).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.set('voucher_path', values.voucher_path[0].dataurl);
        }
      }
      if (selectedFlatRows.length === 1) {
        updatePayment.mutateAsync(formData);
      } else {
        addPayment.mutateAsync(formData);
      }
      setIsOpenAddEditModal(false);
    },
    [selectedFlatRows, setIsOpenAddEditModal, updatePayment, addPayment]
  );

  const initialValues = useMemo(
    () =>
      selectedFlatRows.length === 1
        ? {
            ...selectedFlatRows[0].values,
            voucher_path: [
              {
                dataurl: selectedFlatRows[0].values.voucher_path,
                file: null,
              },
            ],
          }
        : {
            voucher_path: '',
            status: '',
            payment_type: '',
            sinpe_phone_number: '',
          },
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        payment_type: Yup.string().required('El tipo de pago es requerido'),
        status: Yup.string().required('El estado del pago es requerido'),
        voucher_path: Yup.mixed().when('payment_type', {
          is: 'sinpe',
          then: Yup.mixed().required('El comprobante del SINPE es requerido'),
          otherwise: Yup.mixed(),
        }),
        sinpe_phone_number: Yup.string().when('payment_type', {
          is: 'sinpe',
          then: Yup.string()
            .min(8, f({ id: 'helper.phoneMinLength' }))
            .max(10, f({ id: 'helper.phoneMaxLength' }))
            .required('El número de SINPE es requerido'),
          otherwise: Yup.string()
            .min(8, f({ id: 'helper.phoneMinLength' }))
            .max(10, f({ id: 'helper.phoneMaxLength' })),
        }),
      }),
    [f]
  );
  const optionsStatus = [
    { value: 'Pagado', label: 'Pagado' },
    { value: 'Pendiente', label: 'Pendiente de Pago' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];
  const optionsPayment = [
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'sinpe', label: 'Sinpe' },
    { value: 'transferencia', label: 'Transferencia' },
  ];

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty, setFieldValue, values }) => {
            return (
              <Form>
                <Modal.Header>
                  <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {values.payment_type === 'sinpe' && (
                    <>
                      {' '}
                      <Row className="g-0 mb-6 d-flex justify-content-center">
                        <Col className="col-6 top-label products-uploader-component">
                          <UploaderComponent
                            initialImages={values.voucher_path}
                            isError={errors.voucher_path && touched.voucher_path}
                            setFieldValue={setFieldValue}
                          />
                        </Col>
                        <ErrorMessage className="text-danger text-center" name="voucher_path" component="div" />
                      </Row>
                      <Row className="g-3 mb-3">
                        <Col>
                          <div className="top-label">
                            <label className="form-label">{f({ id: 'helper.phone' })}</label>
                            <NumberFormat
                              className="form-control"
                              mask="_"
                              format="####-####"
                              allowEmptyFormatting
                              value={values.sinpe_phone_number}
                              onValueChange={({ value }) => {
                                setFieldValue('sinpe_phone_number', value);
                              }}
                            />
                            <ErrorMessage className="text-danger" name="sinpe_phone_number" component="div" />
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row className="g-3">
                    <Col className="col-12">
                      <SelectField
                        label="Estado de Pago"
                        name="status"
                        placeholder="Seleccione un estado de pago"
                        options={optionsStatus}
                        isError={errors.status && touched.status}
                      />
                    </Col>
                    <Col className="col-12">
                      <SelectField
                        label="Tipo de pago"
                        name="payment_type"
                        placeholder="Seleccione un tipo de pago"
                        options={optionsPayment}
                        isError={errors.payment_type && touched.payment_type}
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
            );
          }}
        </Formik>
      </Card>
    </Modal>
  );
};
