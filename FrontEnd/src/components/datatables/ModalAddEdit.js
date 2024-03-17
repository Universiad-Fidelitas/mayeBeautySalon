import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';

export const ModalAddEdit = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  console.log('forms', formFields);
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
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].values : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formFields.map(({ id, label, type, options }) =>
              type === 'select' ? (
                <div className="mb-3" key={id}>
                  <label className="form-label">{label}</label>

                  <Field className="form-control" name={id} id={id} component={CustomSelect} options={options} />
                  <ErrorMessage style={{ color: 'red' }} name={id} component="div" />
                </div>
              ) : (
                <div className="mb-3" key={id}>
                  <label className="form-label">{label}</label>
                  <Field className="form-control" type={type} id={id} name={id} />
                  <ErrorMessage style={{ color: 'red' }} name={id} component="div" />
                </div>
              )
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
