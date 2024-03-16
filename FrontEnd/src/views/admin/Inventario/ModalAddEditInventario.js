import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import 'react-dropzone-uploader/dist/styles.css';
import { useStock } from 'hooks/react-query/useStock';
import Select from 'react-select';

export const ModalAddEditInventario = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { isLoading, data: productsData } = useStock();
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
          alert(`El producto en la posición ${index + 1} no tiene suficiente cantidad para remover.`);
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
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>Agregar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Acción</label>
                <Field className="form-control" name="action" id="action" component={CustomSelect} options={options} />

                <ErrorMessage name="action" component="div" className="field-error" />
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
                                Products
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
                            Amount
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
                      Add Product
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
