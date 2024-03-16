import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import { useProducts } from 'hooks/react-query/useProducts';
import classNames from 'classnames';

export const ModalAddEditNotificacion = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { isLoading, data: productsData } = useProducts();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name }) => {
        return { value: product_id, label: name };
      }),
    [productsData]
  );

  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      editItem({ ...selectedFlatRows[0].original, ...values });
    } else {
      addItem(values);
    }
    setIsOpenAddEditModal(false);
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
  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} name={id} required />
                <ErrorMessage name={id} component="div" />
              </div>
            ))}
            {productsDataDropdown && (
              <>
                <div className="mb-3">
                  <label className="form-label">Products</label>

                  <Field className="form-control" id="product_id" name="product_id" component={CustomSelect} options={productsDataDropdown} />
                  <ErrorMessage name="product_id" component="div" />
                </div>
              </>
            )}
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
      </Formik>
    </Modal>
  );
};
