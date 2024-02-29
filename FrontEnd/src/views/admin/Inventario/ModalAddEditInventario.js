/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useProducts } from 'hooks/react-query/useProducts';

export const ModalAddEditInventario = ({ tableInstance, addItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const [forms, setForms] = useState({
    action: '',
    description: '',
    dataToInsert: [{ product_id: '', amount: '' }],
  });
  const { isLoading, data: productsData } = useProducts();
  const productDataDropdown = productsData?.items.map(({ product_id, name }) => ({ value: product_id, label: name }));
  const resetForms = () => {
    setForms({
      action: '',
      description: '',
      dataToInsert: [{ product_id: '', amount: '' }],
    });
  };
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setForms((prevForms) => ({
      ...prevForms,
      dataToInsert: prevForms.dataToInsert.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      }),
    }));
  };
  const handleChange2 = (e) => {
    const { id, value } = e.target;
    console.log('audi', value);
    setForms((prevForms) => ({
      ...prevForms,
      action: value,
    }));
  };
  const handleChange3 = (e) => {
    const { id, value } = e.target;

    setForms((prevForms) => ({
      ...prevForms,
      [id]: value,
    }));
  };
  const addFormFields = () => {
    setForms((prevForms) => ({
      ...prevForms,
      dataToInsert: [...prevForms.dataToInsert, { product_id: '', amount: '' }],
    }));
    console.log('mau', forms);
  };

  const removeFormField = (index) => {
    setForms((prevForms) => ({
      ...prevForms,
      dataToInsert: prevForms.dataToInsert.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (values) => {
    if (selectedFlatRows.length !== 1) {
      addItem(values);
    }
    resetForms();
    setIsOpenAddEditModal(false);
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Accion</label>
              <Field className="form-control" as="select" id="action" name="action" required onChange={(e) => handleChange2(e)}>
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
                <Field className="form-control" type={type} id={id} name={id} onChange={(e) => handleChange3(e)} />
                <ErrorMessage name={id} component="div" />
              </div>
            ))}
            {forms.dataToInsert.map((_, index) => (
              <div key={index}>
                <div className="mb-3">
                  <label className="form-label">Producto</label>
                  <Field
                    className="form-control"
                    as="select"
                    name="product_id"
                    onChange={(e) => handleChange(index, e)}
                    value={forms.dataToInsert[index].product_id}
                  >
                    <option value="" disabled>
                      Elige una opción
                    </option>
                    {productDataDropdown &&
                      productDataDropdown.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                  </Field>
                </div>
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <Field
                    className="form-control"
                    type="number"
                    name="amount"
                    onChange={(e) => handleChange(index, e)}
                    value={forms.dataToInsert[index].amount}
                  />
                </div>
                {index !== 0 && (
                  <Button variant="danger" onClick={() => removeFormField(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="primary" onClick={addFormFields}>
              Add Product
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-primary"
              onClick={() => {
                resetForms(); // Call the resetForms function to reset the forms state
                setIsOpenAddEditModal(false); // Close the modal
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => onSubmit(forms)}>
              {selectedFlatRows.length === 1 ? 'Hecho' : 'Agregar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Formik>
    </Modal>
  );
};
