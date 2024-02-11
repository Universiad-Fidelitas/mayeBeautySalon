import React, { useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import { useCategories } from 'hooks/react-query/useCategories';
import { useBrands } from 'hooks/react-query/useBrands';
import { useProviders } from 'hooks/react-query/useProviders';
import classNames from 'classnames';

export const ModalAddEditProductos = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  console.log(selectedFlatRows);
  const { isLoading, data: categoriesData } = useCategories();
  const { data: providersData } = useProviders();

  const { data: brandsData } = useBrands();
  const categoryDataDropdown = useMemo(
    () =>
      categoriesData?.items.map(({ category_id, name }) => {
        return { value: category_id, label: name };
      }),
    [categoriesData]
  );
  const brandDataDropdown = useMemo(
    () =>
      brandsData?.items.map(({ brand_id, name }) => {
        return { value: brand_id, label: name };
      }),
    [brandsData]
  );
  const providerDataDropdown = useMemo(
    () =>
      providersData?.items.map(({ provider_id, name }) => {
        return { value: provider_id, label: name };
      }),
    [providersData]
  );
  const onSubmit = (values) => {
    if (selectedFlatRows.length === 1) {
      console.log('ValuesCategories', values);
      editItem({ ...selectedFlatRows[0].original, ...values });
    } else {
      addItem(values);
    }
    setIsOpenAddEditModal(false);
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
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
            {categoryDataDropdown && brandDataDropdown && providerDataDropdown && (
              <>
                <div className="mb-3">
                  <label className="form-label">Categorias</label>
                  <Field className="form-control" as="select" id="category_id" name="category_id">
                    {categoryDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category_id" component="div" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Brands</label>
                  <Field className="form-control" as="select" id="brand_id" name="brand_id">
                    {brandDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="brand_id" component="div" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Providers</label>
                  <Field className="form-control" as="select" id="provider_id" name="provider_id">
                    {providerDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="provider_id" component="div" />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">Tamaño</label>
              <Field className="form-control" as="select" id="size" name="size">
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </Field>
              <ErrorMessage name="size" component="div" />
            </div>
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
