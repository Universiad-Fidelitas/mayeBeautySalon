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
  const productDataDropdown = productsData?.items.map(({ product_id, name, price }) => ({ value: product_id, label: name, label2: price }));
  const resetForms = () => {
    setForms({
      action: '',
      description: '',
      precio: '',
      dataToInsert: [{ product_id: '', amount: '' }],
    });
  };
  function GetProduct(product, id) {
    id = parseInt(id, 10);
    if (product.value === id) {
      return product;
    }
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target;

    if (e.target.id === 'amount') {
      forms.dataToInsert.forEach((v, i) => {
        let { product_id } = v;
        const { amount } = v;
        product_id = parseInt(product_id, 10);

        const product = productDataDropdown.find((product2) => GetProduct(product2, product_id));
        const Total = product.label2 * Number(amount);

        setForms((prevForms) => ({
          ...prevForms,
          precio: Total,
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
      });
    } else {
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
    }
  };
  const handleChange2 = (e) => {
    const { id, value } = e.target;
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
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Acción</label>
              <Field className="form-control" as="select" id="action" required name="action" onChange={(e) => handleChange2(e)}>
                <option value="" disabled selected>
                  Elige una opción
                </option>
                <option value="add">Agregar</option>
                <option value="remove">Remover</option>
              </Field>
              <ErrorMessage name="action" component="div" />
            </div>

            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} required name={id} onChange={(e) => handleChange3(e)} disabled={!forms.action} />
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
                    id="product_id"
                    required
                    onChange={(e) => handleChange(index, e)}
                    disabled={!forms.description}
                    value={forms.dataToInsert[index].product_id}
                  >
                    <option value="" disabled>
                      Elige una opción
                    </option>
                    {productDataDropdown &&
                      productDataDropdown.map(({ value, label, label2 }) => (
                        <option key={value} value={value} name={label2}>
                          {label}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage name="product_id" component="div" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cantidad</label>
                  <Field
                    className="form-control"
                    type="number"
                    name="amount"
                    id="amount"
                    required
                    onChange={(e) => handleChange(index, e)}
                    value={forms.dataToInsert[index].amount}
                    disabled={!forms.dataToInsert[index].product_id}
                  />
                </div>
                <ErrorMessage name="amount" component="div" />
                {index !== 0 && (
                  <Button variant="danger" onClick={() => removeFormField(index)}>
                    Remover Producto
                  </Button>
                )}
              </div>
            ))}
            <Button variant="primary" onClick={addFormFields}>
              Agregar Producto
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
            <Button variant="primary" onClick={() => onSubmit(forms)} disabled={!forms.dataToInsert[0].amount}>
              {selectedFlatRows.length === 1 ? 'Hecho' : 'Agregar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Formik>
    </Modal>
  );
};
