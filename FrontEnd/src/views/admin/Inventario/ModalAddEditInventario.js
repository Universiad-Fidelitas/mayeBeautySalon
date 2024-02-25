/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useProducts } from 'hooks/react-query/useProducts';

export const ModalAddEditInventario = ({ tableInstance, addItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const [forms, setForms] = useState([{}]);
  const { isLoading, data: productsData } = useProducts();
  const productDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name }) => {
        return { value: product_id, label: name };
      }),
    [productsData]
  );

  const onSubmit = (values, index) => {
    if (selectedFlatRows.length !== 1) {
      addItem(values);
    }
    setIsOpenAddEditModal(false);
    if (index !== 0) {
      setForms(forms.filter((_, i) => i !== index));
    }
  };

  const addForm = () => {
    setForms([...forms, {}]);
    console.log('setForm', forms);
  };

  const removeForm = (index) => {
    console.log('index', index);
    setForms(forms.filter((_, i) => i !== index));
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {productDataDropdown && (
              <>
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <Field className="form-control" as="select" id="product_id" name="product_id" required>
                    <option value="" disabled selected>
                      Elige una opción
                    </option>
                    {productDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="product_id" component="div" />
                </div>
              </>
            )}
            <div className="mb-3" key="amount">
              <label className="form-label">Cantidad</label>
              <Field className="form-control" type="number" id="amount" name="amount" />
              <ErrorMessage name="amount" component="div" />
            </div>
            <div className="mb-3">
              <label className="form-label">Accion</label>
              <Field className="form-control" as="select" id="action" name="action" required>
                <option value="" disabled selected>
                  Elige una opción
                </option>
                <option value="add">Agregar</option>
                <option value="remove">Remover</option>
              </Field>
              <ErrorMessage name="action" component="div" />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <Field
                className="form-control"
                type="text"
                id="precio"
                name="precio"
                required
                readOnly
                onChange={(event) => {
                  event.target.readOnly = false;
                }}
              />
              <ErrorMessage name="precio" component="div" />
            </div>
            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} name={id} />
                <ErrorMessage name={id} component="div" />
              </div>
            ))}

            {productDataDropdown && (
              <>
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <Field className="form-control" as="select" id="product_id" name="product_id" required>
                    <option value="" disabled selected>
                      Elige una opción
                    </option>
                    {productDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="product_id" component="div" />
                </div>
              </>
            )}
          </Modal.Body>
        </Form>
      </Formik>
    </Modal>
  );
};
