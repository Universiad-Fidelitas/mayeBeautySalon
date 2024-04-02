import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useCategories } from 'hooks/react-query/useCategories';

export const CategoriasModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateCategory, addCategory } = useCategories(apiParms);

  const onSubmit = useCallback(
    (values) => {
      if (selectedFlatRows.length === 1) {
        updateCategory.mutateAsync(values);
      } else {
        addCategory.mutateAsync(values);
      }
      setIsOpenAddEditModal(false);
    },
    [setIsOpenAddEditModal, selectedFlatRows, addCategory]
  );

  const initialValues = useMemo(
    () => ({
      category_id: selectedFlatRows?.[0]?.original.category_id || '',
      name: selectedFlatRows?.[0]?.original.name || '',
    }),
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string()
          .required(f({ id: 'categories.nameRequired' }))
          .min(3, f({ id: 'categories.nameMinLength' }))
          .max(20, f({ id: 'categories.nameMaxLength' })),
      }),
    [f]
  );

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty }) => (
            <Form>
              <Modal.Header>
                <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="g-3">
                  <Col>
                    <div className="top-label">
                      <label className="form-label">{f({ id: 'helper.name' })}</label>
                      <Field className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} id="name" name="name" />
                      <ErrorMessage className="text-danger" name="name" component="div" />
                    </div>
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
