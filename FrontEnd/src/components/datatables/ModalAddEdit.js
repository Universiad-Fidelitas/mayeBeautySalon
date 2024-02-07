import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';

export const ModalAddEdit = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;

  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      editItem({ ...selectedFlatRows[0].values, ...values });
    } else {
      addItem(values);
    }
    setIsOpenAddEditModal(false);
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].values : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} name={id} />
                <ErrorMessage name={id} component="div" />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedFlatRows.length === 1 ? 'Done' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Formik>
    </Modal>
  );
};
