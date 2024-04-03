import React, { useMemo } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import 'react-dropzone-uploader/dist/styles.css';
import { useStock } from 'hooks/react-query/useStock';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { SelectField } from 'components/SelectField';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

export const ModalAddEditInventario = ({ tableInstance, addItem, validationSchema }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: productsData } = useStock();
  const { formatMessage: f } = useIntl();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name, total_amount }) => {
        return { value: product_id, label: name, amount: total_amount };
      }),
    [productsData]
  );
  console.log('karoIng', productsDataDropdown);
  const initialValues = {
    action: '',
    description: '',
    dataToInsert: [{ product_id: '', amount: '' }],
  };

  const onSubmit = (values) => {
    let isValid = true;
    console.log('values', values);
    values.dataToInsert.forEach((item, index) => {
      if (values.action === 'remove') {
        const product = productsDataDropdown.find((p) => p.value === item.product_id);
        console.log('product', product);
        if (product && Number(product.amount) < item.amount) {
          isValid = false;
          // ARREGLAR ESTO USAR UN TOAST
          console.log(index);
          toast(f({ id: `El producto en la posición ${index + 1} no tiene suficiente cantidad para remover.` }), { className: 'danger' });
        }
      }
    });

    if (isValid) {
      addItem(values);
      setIsOpenAddEditModal(false);
    }
  };
  const CustomSelect = ({ field, form, options }) => (
    <Select
      classNamePrefix="react-select"
      options={options}
      name={field.name}
      value={options ? options.find((option) => option.value === field.value) : ''}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      placeholder="Seleccione una opcion"
    />
  );
  const options = [
    { value: 'add', label: 'Agregar' },
    { value: 'remove', label: 'Remover' },
  ];
  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ errors, touched, values, setFieldValue }) => {
          console.log('isOpenAddEditModal', values, errors, touched)
        return (
          <Form>
            <Modal.Header>
              <Modal.Title>Agregar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-3 mb-3">
                <Col className="col-12 top-label">
                  <SelectField
                    label='Acción'
                    name="action"
                    placeholder='Seleccione una opcion'
                    options={options}
                    isError={errors.action && touched.action}
                  />
                </Col>
              </Row>

              <Row className="g-3 mb-3">
                <Col>
                  <div className="top-label">
                    <label className="form-label">Descripción</label>
                    <Field as='textarea' className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`} id="description" name="description" />
                    <ErrorMessage className="text-danger" name="description" component="div" />
                  </div>
                </Col>
              </Row>

              <hr className='mb-3 mt-4'/>
              <h4 className="mb-3">Información Productos</h4>

              <FieldArray name="dataToInsert">
                {({ push, remove }) => (
                  <div>
                    {values.dataToInsert.map((_, index) => (
                      <Row key={index}>
                        <Row className="g-3 mb-3 m-0">
                          <Col className="col-5 m-0">
                            <div className="top-label">
                              <SelectField
                                className="m-0"
                                label='Productos'
                                name={`dataToInsert.${index}.product_id`}
                                placeholder='Seleccione producto'
                                options={productsDataDropdown}
                                isError={errors.dataToInsert && errors.dataToInsert[index]?.product_id && touched.dataToInsert && touched.dataToInsert[index]?.product_id}
                              />
                            </div>
                          </Col>
                          <Col className="col-4 m-0">
                            <div className="top-label">
                              <label className="form-label">Cantidad</label>
                              <NumberFormat
                                className={classNames('form-control', { 'is-invalid': errors.dataToInsert && errors.dataToInsert[index]?.amount && touched.dataToInsert && touched.dataToInsert[index]?.amount })}
                                allowEmptyFormatting 
                                isAllowed={({ value }) => (value <= 50) && true}
                                value={values.dataToInsert[index].cantidad}
                                onValueChange={({ value }) => {
                                  setFieldValue(`dataToInsert.${index}.amount`, value);
                                }}
                              />
                              <ErrorMessage className="text-danger" name={`dataToInsert.${index}.amount`} component="div" />
                            </div>
                          </Col>
                          <Col className="col-3 m-0">
                            <Row className="g-3 m-0">
                            {values.dataToInsert.length -1 === index && (
                              <Col className="col-6 m-0">
                                <Button variant="success w-100 p-2" onClick={() => push({ product_id: '', amount: '' })}>
                                  <CsLineIcons icon="plus" />
                                </Button>
                              </Col>
                              )}
                              {index > 0 && (
                                <Col className="col-6 m-0">
                                  <Button variant="danger w-100 p-2" onClick={() => remove(index)}>
                                    <CsLineIcons icon="bin" />
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Row>
                    ))}
                  </div>
                )}
              </FieldArray>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedFlatRows.length === 1 ? 'Hecho' : 'Agregar'}
              </Button>
            </Modal.Footer>
          </Form>
        )}}
      </Formik>
    </Modal>
  );
};
