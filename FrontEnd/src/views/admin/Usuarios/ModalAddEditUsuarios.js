import React, { useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import { useRoles } from 'hooks/react-query/useRoles';
import classNames from 'classnames';

export const ModalAddEditUsuarios = ({ tableInstance, addItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { isLoading, data: rolesData } = useRoles();
  const [userRolSelected, setUserRolSelected] = useState();
  const initialData = { first_name: '', last_name: '', cedula: '', email: '', phone: '' };

  const rolDataDropdown = useMemo(
    () =>
      rolesData?.items.map(({ role_id, name }) => {
        return { value: role_id, label: name };
      }),
    [rolesData]
  );

  const onSubmit = (values) => {
    const userSchema = {
      ...values,
      role_id: userRolSelected.value,
      imagen: 'Karolay',
      password: '1234567976',
    };
    // if (selectedFlatRows.length === 1) {
    //   editItem({ ...selectedFlatRows[0].values, ...values });
    // } else {
    addItem(userSchema);
    // }
    setIsOpenAddEditModal(false);

    console.log('ModalAddEditUsuarios', values, userRolSelected);
  };

  const getUploadParams = () => ({ url: 'https://httpbin.org/post' });

  const onChangeStatus = (fileWithMeta, status) => {
    console.log(fileWithMeta);
    console.log(status);
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card className={classNames('mb-5', { 'overlay-spinner': isLoading })}>
        <Formik
          initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].values : initialData}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <Modal.Header>
              <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col className="d-flex flex-row justify-content-between align-items-center mb-3">
                <label className="form-label m-0">Usuario activo</label>
                <FormCheck className="form-check mt-2 ps-7 ps-md-2" type="switch" />
              </Col>
              <Col className="d-flex flex-column justify-content-between align-items-left mb-3">
                <Dropzone
                  getUploadParams={getUploadParams}
                  PreviewComponent={DropzonePreview}
                  submitButtonContent={null}
                  accept="image/*"
                  submitButtonDisabled
                  SubmitButtonComponent={null}
                  inputWithFilesContent={null}
                  onChangeStatus={onChangeStatus}
                  classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
                  inputContent="Imagen de usuario"
                />
              </Col>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <Select
                  classNamePrefix="react-select"
                  options={rolDataDropdown}
                  value={userRolSelected}
                  onChange={setUserRolSelected}
                  placeholder="Seleccione el rol del usuario"
                />
                <ErrorMessage name="role_id" component="div" />
              </div>
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
      </Card>
    </Modal>
  );
};
