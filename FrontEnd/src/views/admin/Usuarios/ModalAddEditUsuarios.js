import React, { useCallback, useMemo } from 'react';
import { Button, Card, Col, FormCheck, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useRoles } from 'hooks/react-query/useRoles';
import classNames from 'classnames';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { forgotPassword } from 'store/slices/authThunk';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { IconNotification } from 'components/notifications/IconNotification';
import 'react-dropzone-uploader/dist/styles.css';
import * as Yup from 'yup';
import { UploaderComponent } from 'components/imagesUploader/UploaderComponent';
import { useIntl } from 'react-intl';
import { SelectField } from 'components/SelectField';
import { useUsers } from 'hooks/react-query/useUsers';

export const ModalAddEditUsuarios = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateUser, addUser } = useUsers(apiParms);

  const { isLoading, data: rolesData } = useRoles();
  const rolDataDropdown = useMemo(
    () =>
      rolesData?.items.map(({ role_id, name }) => {
        return { value: role_id, label: name };
      }),
    [rolesData]
  );
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values) => {
      const formData = new FormData();
      const userSchema = {
        ...values,
      };
      if (values.image[0].file) {
        Object.entries(userSchema).forEach(([key, value]) => {
          if (key !== 'image') {
            formData.append(key, value);
          }
        });

        formData.append('image', values.image[0].file);
      } else {
        Object.entries(userSchema).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.set('image', values.image[0].dataurl);
      }
      formData.set('activated', values.activated ? 1 : 0);
      if (selectedFlatRows.length === 1) {
        updateUser.mutateAsync(formData);
      } else {
        addUser.mutateAsync(formData);
      }
      setIsOpenAddEditModal(false);
    },
    [selectedFlatRows, addUser, setIsOpenAddEditModal, updateUser]
  );

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

  const initialValues = useMemo(
    () =>
      selectedFlatRows.length === 1
        ? {
            ...selectedFlatRows[0].values,
            activated: selectedFlatRows[0].values.activated === 1,
            image: [
              {
                dataurl: selectedFlatRows[0].values.image,
                file: null,
              },
            ],
          }
        : {
            id_card: '',
            first_name: '',
            last_name: '',
            image: '',
            email: '',
            phone: '',
            salary: '',
            role_id: '',
            activated: true,
          },
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        first_name: Yup.string()
          .required(f({ id: 'helper.nameRequired' }))
          .min(3, f({ id: 'helper.nameMinLength' }))
          .max(20, f({ id: 'helper.nameMaxLength' })),
        last_name: Yup.string()
          .required(f({ id: 'helper.lastnameRequired' }))
          .min(3, f({ id: 'helper.lastnameMinLength' }))
          .max(20, f({ id: 'helper.lastnameMaxLength' })),
        email: Yup.string()
          .email(f({ id: 'helper.emailInvalid' }))
          .required(f({ id: 'helper.emailRequired' })),
        phone: Yup.string()
          .matches(/^\d+$/, f({ id: 'helper.phoneOnlyNumbers' }))
          .min(8, f({ id: 'helper.phoneMinLength' }))
          .max(10, f({ id: 'helper.phoneMaxLength' }))
          .required(f({ id: 'helper.phoneRequired' })),
        image: Yup.mixed().required(f({ id: 'users.imageRequired' })),
        id_card: Yup.string()
          .required(f({ id: 'helper.idCardRequired' }))
          .matches(/^\d+$/, f({ id: 'helper.idCardOnlyNumbers' }))
          .min(9, f({ id: 'helper.idCardMinSize' }))
          .max(12, f({ id: 'helper.idCardMaxSize' })),
        salary: Yup.number()
          .typeError(f({ id: 'users.salaryNumber' }))
          .positive(f({ id: 'users.salaryPositiveNumber' }))
          .integer(f({ id: 'users.salaryInteger' }))
          .min(0, f({ id: 'users.salaryMin' }))
          .required(f({ id: 'users.salaryRequired' })),
        role_id: Yup.string().required(f({ id: 'users.rolRequired' })),
      }),
    [f]
  );

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card className={classNames('mb-5', { 'overlay-spinner': isLoading })}>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, setFieldValue, values, dirty }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="g-0 mb-3 d-flex justify-content-center">
                  <Col className="col-6 top-label">
                    <UploaderComponent initialImages={values.image} isError={errors.image && touched.image} setFieldValue={setFieldValue} />
                  </Col>
                  <ErrorMessage className="text-danger text-center" name="image" component="div" />
                </Row>

                <Row className="g-3 mb-3">
                  {selectedFlatRows.length === 1 && (
                    <Col className="col-6">
                      <Button variant="outline-primary" onClick={enviarEmail} className="btn-icon btn-icon-start sendPasswordButton">
                        <CsLineIcons icon="email" />
                        <span> {f({ id: 'users.passwordReset' })}</span>
                      </Button>
                    </Col>
                  )}
                  <Col className="col-3">
                    <div className="d-flex flex-row justify-content-between align-items-center activationSwitch">
                      <label className="form-label">{f({ id: 'services.serviceState' })}</label>
                      <FormCheck
                        className="form-check"
                        type="switch"
                        checked={values.activated}
                        onChange={() => setFieldValue('activated', !values.activated)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col className="col-4">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.idcard' })}</label>
                      <Field className={`form-control ${errors.id_card && touched.id_card ? 'is-invalid' : ''}`} id="id_card" name="id_card" />
                      <ErrorMessage className="text-danger" name="id_card" component="div" />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.name' })}</label>
                      <Field className={`form-control ${errors.first_name && touched.first_name ? 'is-invalid' : ''}`} id="first_name" name="first_name" />
                      <ErrorMessage className="text-danger" name="first_name" component="div" />
                    </div>
                  </Col>
                  <Col className="col-6 top-label">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.lastname' })}</label>
                      <Field className={`form-control ${errors.last_name && touched.last_name ? 'is-invalid' : ''}`} id="last_name" name="last_name" />
                      <ErrorMessage className="text-danger" name="last_name" component="div" />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col className="col-8">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.email' })}</label>
                      <Field className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} id="email" name="email" />
                      <ErrorMessage className="text-danger" name="email" component="div" />
                    </div>
                  </Col>
                  <Col className="col-4 top-label">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.phone' })}</label>
                      <Field className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`} id="phone" name="phone" />
                      <ErrorMessage className="text-danger" name="phone" component="div" />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col className="col-4">
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.salary' })}</label>
                      <Field className={`form-control ${errors.salary && touched.salary ? 'is-invalid' : ''}`} id="salary" name="salary" />
                      <ErrorMessage className="text-danger" name="salary" component="div" />
                    </div>
                  </Col>
                  <Col className="col-8 top-label">
                    <SelectField
                      label={f({ id: 'helper.role' })}
                      name="role_id"
                      placeholder={f({ id: 'helper.selectRol' })}
                      options={rolDataDropdown}
                      isError={errors.role_id && touched.role_id}
                    />
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
                  {f({ id: 'helper.cancel' })}
                </Button>
                <Button variant="primary" type="submit" disabled={selectedFlatRows.length === 1 && !dirty && true}>
                  {selectedFlatRows.length === 1 ? f({ id: 'helper.edit' }) : f({ id: 'helper.add' })}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Card>
    </Modal>
  );
};
