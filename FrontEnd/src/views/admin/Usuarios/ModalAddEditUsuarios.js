import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import { useRoles } from 'hooks/react-query/useRoles';
import classNames from 'classnames';
import { UsuariosImageUploader } from 'components/ImageUploading/UsuariosImageUploader';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { forgotPassword } from 'store/slices/authThunk';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { IconNotification } from 'components/notifications/IconNotification';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';

export const ModalAddEditUsuarios = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;

  const { isLoading, data: rolesData } = useRoles();
  const [profileImage, setProfileImage] = useState([]);
  const rolDataDropdown = useMemo(
    () =>
      rolesData?.items.map(({ role_id, name }) => {
        return { value: role_id, label: name };
      }),
    [rolesData]
  );
  const [activeUser, setActiveUser] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values) => {
      console.log(values);
      const formData = new FormData();
      const userSchema = {
        ...values,
      };

      if (profileImage[0]?.dataurl.startsWith('data:')) {
        Object.entries(userSchema).forEach(([key, value]) => {
          if (key !== 'image') {
            formData.append(key, value);
          }
        });
        formData.append('image', profileImage[0].file);
      } else {
        Object.entries(userSchema).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      if (selectedFlatRows.length === 1) {
        editItem({
          formData,
          userId: selectedFlatRows[0].values.user_id,
        });
      } else {
        addItem(formData);
      }
      setProfileImage([]);
      setIsOpenAddEditModal(false);
    },
    [profileImage, selectedFlatRows, activeUser]
  );

  const handleImageFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    setProfileImage([{ file: new File([blob], filename, { type: blob.type }), dataurl: url }]);
  };

  useEffect(() => {
    if (selectedFlatRows.length === 1) {
      handleImageFromUrl(`${process.env.REACT_APP_BASE_API_URL}/${selectedFlatRows[0].values.image}`);
    } else {
      setProfileImage([]);
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    if (!isOpenAddEditModal) {
      setProfileImage([]);
    }
  }, [isOpenAddEditModal]);

  const enviarEmail = async () => {
    if (selectedFlatRows.length === 1) {
      const { status, message } = await dispatch(forgotPassword(selectedFlatRows[0].values.email));
      if (status) {
        toast(<IconNotification title="Enlace enviado" description={message} toastType="success" />, { className: 'success' });
      } else {
        toast(<IconNotification title="No encontrado" description={message} toastType="danger" />, { className: 'danger' });
      }
    }
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card className={classNames('mb-5', { 'overlay-spinner': isLoading })}>
        <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form>
            <Modal.Header>
              <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedFlatRows.length === 1 && (
                <Col className="d-flex flex-row justify-content-between align-items-center mb-3">
                  <Button variant="outline-primary" onClick={enviarEmail} className="btn-icon btn-icon-start w-100 w-md-auto add-datatable">
                    <CsLineIcons icon="email" />
                    <span> Restablecer Contraseña</span>
                  </Button>
                </Col>
              )}
              <div className="mb-3">
                <label className="form-label">Activo</label>
                <Field className="form-control" as="select" id="activated" name="activated">
                  <option value="" disabled selected>
                    Elige una opción
                  </option>
                  <option value="1">Activado</option>
                  <option value="0">Desactivado</option>
                </Field>
                <ErrorMessage name="activated" component="div" />
              </div>
              <Col className="d-flex flex-column justify-content-between align-items-center mb-3">
                <UsuariosImageUploader initialImages={profileImage} setImageState={setProfileImage} />
              </Col>
              {rolDataDropdown && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Roles</label>
                    <Field className="form-control" as="select" id="role_id" name="role_id">
                      <option value="" disabled selected>
                        Elige una opción
                      </option>
                      {rolDataDropdown.map(({ value, label }, length) => (
                        <option key={length} value={value}>
                          {label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="role_id" component="div" />
                  </div>
                </>
              )}

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
