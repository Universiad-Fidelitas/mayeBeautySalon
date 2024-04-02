import React, { useEffect, useState } from 'react';
import { Button, Col, FormCheck, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { DB_TABLE_ROLS } from 'data/rolsData';
import { useExportAllPermissions } from 'hooks/useUserPermissions';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';

export const ModalEditPermissions = ({ tableInstance, addItem, editItem }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const [permissionsList, setPermissionsList] = useState([]);
  const [allSwitchChangeStatus, setAllSwitchChangeStatus] = useState(false);
  const fullPermissionsList = useExportAllPermissions();

  useEffect(() => {
    if (selectedFlatRows.length === 1) {
      setPermissionsList(JSON.parse(selectedFlatRows[0].values.permissions));
    } else {
      setPermissionsList([]);
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    if (permissionsList.length === fullPermissionsList.length) {
      setAllSwitchChangeStatus(true);
    } else {
      setAllSwitchChangeStatus(false);
    }
  }, [permissionsList, fullPermissionsList.length]);

  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      editItem({ ...selectedFlatRows[0].values, ...values, permissions: permissionsList });
    } else {
      addItem({ ...values, permissions: permissionsList });
    }
    setIsOpenAddEditModal(false);
  };

  const onSwitchChange = (permissionKeyName) => {
    const permissionOnList = permissionsList.some((permission) => permission === permissionKeyName.toUpperCase());
    if (permissionOnList) {
      const updatedPermissions = permissionsList.filter((permission) => permission !== permissionKeyName.toUpperCase());
      setPermissionsList(updatedPermissions);
    } else {
      setPermissionsList([...permissionsList, permissionKeyName.toUpperCase()]);
    }
  };

  const onAllSwitchChange = () => {
    if (allSwitchChangeStatus) {
      setPermissionsList([]);
    } else {
      setPermissionsList(fullPermissionsList);
    }
    setAllSwitchChangeStatus(!allSwitchChangeStatus);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('El nombre es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(15, 'El nombre no puede tener más de 15 caracteres'),
  });

  console.log('selectedFlatRows', selectedFlatRows[0]);

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik
        initialValues={
          selectedFlatRows.length === 1
            ? selectedFlatRows[0].values
            : {
                name: '',
                permissions: '',
              }
        }
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, setFieldValue, values, dirty }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-3">
                <Col>
                  <div className="top-label">
                    <label className="form-label">Nombre del rol</label>
                    <Field className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} id="name" name="name" />
                    <ErrorMessage className="text-danger" name="name" component="div" />
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col className="d-flex flex-row justify-content-between align-items-center">
                  <p className="h6 m-0">Todos los roles</p>
                  <FormCheck
                    className={`form-check mt-2 ps-7 ps-md-2 ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    type="switch"
                    checked={allSwitchChangeStatus}
                    onChange={() => onAllSwitchChange()}
                  />
                </Col>
              </Row>
              {DB_TABLE_ROLS.map(({ permissionName, permissionKey }, index) => (
                <div className="mb-3" key={index}>
                  <Col className="d-flex flex-row justify-content-between align-items-center">
                    <p className="h6 text-primary">{permissionName}</p>
                  </Col>
                  <Col className="d-flex flex-row justify-content-between align-items-center">
                    <label className="form-label m-0">Crear</label>
                    <FormCheck
                      className="form-check mt-2 ps-7 ps-md-2"
                      type="switch"
                      checked={permissionsList.includes(`C_${permissionKey}`)}
                      onChange={() => onSwitchChange(`C_${permissionKey}`)}
                    />
                  </Col>
                  <Col className="d-flex flex-row justify-content-between align-items-center">
                    <label className="form-label m-0">Obtener</label>
                    <FormCheck
                      className="form-check mt-2 ps-7 ps-md-2"
                      type="switch"
                      checked={permissionsList.includes(`R_${permissionKey}`)}
                      onChange={() => onSwitchChange(`R_${permissionKey}`)}
                    />
                  </Col>
                  <Col className="d-flex flex-row justify-content-between align-items-center">
                    <label className="form-label m-0">Actualizar</label>
                    <FormCheck
                      className="form-check mt-2 ps-7 ps-md-2"
                      type="switch"
                      checked={permissionsList.includes(`U_${permissionKey}`)}
                      onChange={() => onSwitchChange(`U_${permissionKey}`)}
                    />
                  </Col>
                  <Col className="d-flex flex-row justify-content-between align-items-center">
                    <label className="form-label m-0">Eliminar</label>
                    <FormCheck
                      className="form-check mt-2 ps-7 ps-md-2"
                      type="switch"
                      checked={permissionsList.includes(`D_${permissionKey}`)}
                      onChange={() => onSwitchChange(`D_${permissionKey}`)}
                    />
                  </Col>
                  <hr />
                </div>
              ))}
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
