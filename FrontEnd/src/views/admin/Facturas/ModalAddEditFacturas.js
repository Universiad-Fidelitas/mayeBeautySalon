import React, { useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import 'react-dropzone-uploader/dist/styles.css';
import { useStock } from 'hooks/react-query/useStock';
import Select from 'react-select';

export const ModalAddEditFacturas = ({ tableInstance, addItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: productsData } = useStock();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name, total_amount }) => {
        return { value: product_id, label: name, amount: total_amount };
      }),
    [productsData]
  );
  const initialValues = {
    status: '',
    payment_type: '',
    sinpe_phone_number: '',
    description: '',
    id_card: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    payment_id: '',
    inventory_id: '',
    dataToInsert: [{ product_id: '', amount: '', invetory_products_id: '' }],
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
          // alert(`El producto en la posición ${index + 1} no tiene suficiente cantidad para remover.`);
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

  const optionsStatus = [
    { value: 'done', label: 'Pagado' },
    { value: 'pending', label: 'Pendiente de Pago' },
  ];
  const optionsPayment = [
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'sinpe', label: 'Sinpe' },
  ];
  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik
        initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>Agregar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Estado del Pago</label>
                <Field className="form-control" name="status" id="status" component={CustomSelect} options={optionsStatus} />
                <ErrorMessage name="status" component="div" className="field-error" />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Pago</label>
                <Field className="form-control" name="payment_type" id="payment_type" component={CustomSelect} options={optionsPayment} />
                <ErrorMessage name="payment_type" component="div" className="field-error" />
              </div>
              <div className="mb-3" key="description">
                <label className="form-label">Descripción</label>
                <Field as="textarea" className="form-control" type="text" id="description" name="description" />
                <ErrorMessage name="description" component="div" />
              </div>

              <div className="mb-3" key="payment_id">
                <label className="form-label">ID del pago</label>
                <Field className="form-control" type="text" id="payment_id" name="payment_id" disabled value={values.payment_id || '0'} />
                <ErrorMessage name="payment_id" component="div" />
              </div>
              <div className="mb-3" key="inventory_id">
                <label className="form-label">ID de la venta</label>
                <Field className="form-control" type="text" id="inventory_id" name="inventory_id" disabled value={values.inventory_id || '0'} />
                <ErrorMessage name="inventory_id" component="div" />
              </div>

              {formFields.map(({ id, label, type }) => (
                <div className="mb-3" key={id}>
                  <label className="form-label">{label}</label>
                  <Field className="form-control" type={type} id={id} name={id} />
                  <ErrorMessage name={id} component="div" />
                </div>
              ))}

              <FieldArray name="dataToInsert">
                {({ push, remove }) => (
                  <div>
                    {values.dataToInsert.map((_, index) => (
                      <div className="row" key={index}>
                        {productsDataDropdown && (
                          <>
                            <div className="mb-3">
                              <label className="form-label" htmlFor={`dataToInsert.${index}.product_id`}>
                                Productos
                              </label>

                              <Field
                                className="form-control"
                                name={`dataToInsert.${index}.product_id`}
                                id="product_id"
                                component={CustomSelect}
                                options={productsDataDropdown}
                              />
                              <ErrorMessage name={`dataToInsert.${index}.product_id`} className="field-error" component="div" />
                            </div>
                          </>
                        )}
                        <div className="mb-3">
                          <label className="form-label" htmlFor={`dataToInsert.${index}.amount`}>
                            Cantidad
                          </label>
                          <Field name={`dataToInsert.${index}.amount`} className="form-control" type="number" id="amount" />
                          <ErrorMessage name={`dataToInsert.${index}.amount`} component="div" className="field-error" />
                        </div>
                        {index > 0 && (
                          <div className="mb-3">
                            <Button variant="danger" onClick={() => remove(index)}>
                              Remover Producto
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button variant="primary" onClick={() => push({ product_id: '', amount: '' })}>
                      Agregar Producto
                    </Button>
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
        )}
      </Formik>
    </Modal>
  );
};
