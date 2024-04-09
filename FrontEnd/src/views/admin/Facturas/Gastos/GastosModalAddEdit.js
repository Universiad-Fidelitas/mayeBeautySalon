import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useExpenses } from 'hooks/react-query/useExpenses';
import { SelectField } from 'components/SelectField';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

export const GastosModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateExpense, addExpense } = useExpenses(apiParms);

  const onSubmit = useCallback(
    (values) => {
      if (selectedFlatRows.length === 1) {
        updateExpense.mutateAsync(values);
      } else {
        addExpense.mutateAsync(values);
      }
      setIsOpenAddEditModal(false);
    },
    [setIsOpenAddEditModal, selectedFlatRows, updateExpense, addExpense]
  );

  const initialValues = useMemo(
    () => ({
      expense_id: selectedFlatRows?.[0]?.original.expense_id || '',
      expense_type: selectedFlatRows?.[0]?.original.expense_type || '',
      date: selectedFlatRows?.[0]?.original.date || '',
      price: selectedFlatRows?.[0]?.original.price || '',
    }),
    [selectedFlatRows]
  );
  const validationSchema = Yup.object().shape({
    expense_type: Yup.string().required('El tipo de gasto es requerido'),
    price: Yup.number().required('El precio del gasto es requerido').min(1, 'El precio debe ser mayor a 1'),
  });
  const TypeOptions = [
    { value: 'Recibo de Internet', label: 'Recibo de Internet' },
    { value: 'Recibo de Luz', label: 'Recibo de Luz' },
    { value: 'Recibo de Agua', label: 'Recibo de Agua' },
    { value: 'Renta', label: 'Renta' },
  ];
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
                  <Col className="col-12">
                    <SelectField
                      label="Nombre del gasto"
                      name="expense_type"
                      placeholder="Seleccione una opción"
                      options={TypeOptions}
                      isError={errors.expense_type && touched.expense_type}
                    />
                  </Col>
                </Row>
                <Row className="g-3 mb-3">
                  <Col className="col-12">
                    <div className="top-label">
                      <label className="form-label">Precio del recibo</label>
                      <NumberFormat
                        className={classNames('form-control', { 'is-invalid': errors.price && touched.price })}
                        thousandSeparator="."
                        decimalSeparator=","
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
