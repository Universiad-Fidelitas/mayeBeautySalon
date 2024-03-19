import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Row, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import classNames from 'classnames';

export const ModalAddEditServices2 = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;

  const onSubmit = (values) => {
    values.duration += `.${values.duration_m}`;
    delete values.size_m;

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
  const options = [...Array.from({ length: 13 }, (_, i) => ({ value: i.toString(), label: i.toString() }))];
  const options2 = [...Array.from({ length: 60 }, (_, i) => ({ value: i.toString(), label: i.toString() }))];
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
            {
              <div className="mb-3" key="size">
                <label className="form-label">Duración</label>
                <Row>
                  <Col sm="6">
                    <Field className="form-control" id="duration" name="duration" component={CustomSelect} options={options} required />
                  </Col>
                  <Col sm="6">
                    <Field className="form-control" id="duration_m" name="duration_m" component={CustomSelect} options={options2} required />
                  </Col>
                </Row>

                <ErrorMessage style={{ color: 'red' }} name="duration" component="div" />
              </div>
            }
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
