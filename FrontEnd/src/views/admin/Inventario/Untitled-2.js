import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import { useProducts } from 'hooks/react-query/useProducts';
import classNames from 'classnames';

export const ModalAddEditInventario = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { isLoading, data: productsData } = useProducts();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name }) => {
        return { value: product_id, label: name };
      }),
    [productsData]
  );
  const initialValues = {
    action: '',
    description: '',
    dataToInsert: [{ product_id: '', amount: '' }],
  };

  const onSubmit = (values) => {
    addItem(values);

    setIsOpenAddEditModal(false);
  };

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
                <Field className="form-control" as="select" id="action" name="action">
                  <option value="" disabled selected>
                    Elige una opción
                  </option>
                  <option value="add">Agregar</option>
                  <option value="remove">Remover</option>
                </Field>
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
                              <Field className="form-control" as="select" id="product_id" name={`dataToInsert.${index}.product_id`}>
                                <option value="" disabled selected>
                                  Elige una opción
                                </option>
                                {productsDataDropdown.map(({ value, label }, length) => (
                                  <option key={length} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </Field>
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
                        <div className="mb-3">
                          <Button variant="danger" onClick={() => remove(index)}>
                            Remover Producto
                          </Button>
                        </div>
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
