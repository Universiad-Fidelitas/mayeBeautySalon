import React, { useEffect, useState } from 'react';
import { Button, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { DB_TABLE_ROLS } from 'data/rolsData';

export const ModalEditPermissions = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const [permissionsList, setPermissionsList] = useState([]);

  useEffect(() => {
    if (selectedFlatRows.length === 1) {
      setPermissionsList(JSON.parse(selectedFlatRows[0].values.permissions));
    } else {
      setPermissionsList([]);
    }
  }, [selectedFlatRows])

  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      editItem({ ...selectedFlatRows[0].values, ...values, permissions: permissionsList});
    } else {
      addItem({...values, permissions: permissionsList});
    }
    setIsOpenAddEditModal(false);
  };

  const onSwitchChange = (permissionKeyName) => {
    const permissionOnList = permissionsList.some((permission) => permission === permissionKeyName.toUpperCase());
    if (permissionOnList) {
        const updatedPermissions = permissionsList.filter(permission => permission !== permissionKeyName.toUpperCase());
        setPermissionsList(updatedPermissions);
    } else {
        setPermissionsList([...permissionsList, permissionKeyName.toUpperCase()]);
    }
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].values : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formFields.map(({ id, label }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type="text" id={id} name={id} />
                <ErrorMessage name={id} component="div" />
              </div>
            ))}
            {
              DB_TABLE_ROLS.map(({ permissionName, permissionKey }, index) => (
                  <div className="mb-3" key={index}>
                      <Col className="d-flex flex-row justify-content-between align-items-center">
                          <p className="h6 text-primary">{ permissionName }</p>
                      </Col>
                      <Col className="d-flex flex-row justify-content-between align-items-center">
                          <label className="form-label m-0">Crear</label>
                          <FormCheck className="form-check mt-2 ps-7 ps-md-2" type="switch" checked={ permissionsList.includes(`C_${permissionKey}`) } onChange={() => onSwitchChange(`C_${permissionKey}`)}/>
                      </Col>
                      <Col className="d-flex flex-row justify-content-between align-items-center">
                          <label className="form-label m-0">Editar</label>
                          <FormCheck className="form-check mt-2 ps-7 ps-md-2" type="switch" checked={ permissionsList.includes(`R_${permissionKey}`) } onChange={() => onSwitchChange(`R_${permissionKey}`)}/>
                      </Col>
                      <Col className="d-flex flex-row justify-content-between align-items-center">
                          <label className="form-label m-0">Actualizar</label>
                          <FormCheck className="form-check mt-2 ps-7 ps-md-2" type="switch" checked={ permissionsList.includes(`U_${permissionKey}`) } onChange={() => onSwitchChange(`U_${permissionKey}`)}/>
                      </Col>
                      <Col className="d-flex flex-row justify-content-between align-items-center">
                          <label className="form-label m-0">Eliminar</label>
                          <FormCheck className="form-check mt-2 ps-7 ps-md-2" type="switch" checked={ permissionsList.includes(`D_${permissionKey}`) } onChange={() => onSwitchChange(`D_${permissionKey}`)}/>
                      </Col>
                      <hr/>
                  </div>
              ))
            }
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
