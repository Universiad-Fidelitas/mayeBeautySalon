import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from 'components/dropzone/DropzonePreview';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import { useCategories } from 'hooks/react-query/useCategories';
import { useBrands } from 'hooks/react-query/useBrands';
import { useProviders } from 'hooks/react-query/useProviders';
import { ProductosImageUploader } from 'components/ImageUploading/ProductsImageUploader';
import classNames from 'classnames';

export const ModalAddEditProductos = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  console.log('Joe', selectedFlatRows);
  const { isLoading, data: categoriesData } = useCategories();
  const { data: providersData } = useProviders();
  const [productImage, setProductImage] = useState([]);
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
    const formData = new FormData();
    const productSchema = {
      ...values,
      image: productImage[0].file,
    };
    Object.entries(productSchema).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedFlatRows.length === 1) {
      editItem({ formData, product_id: selectedFlatRows[0].original.product_id });
    } else {
      addItem(formData);
    }
    setIsOpenAddEditModal(false);
  };

  const handleImageFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    setProductImage([{ file: new File([blob], filename, { type: blob.type }), dataurl: url }]);
  };

  useEffect(() => {
    if (selectedFlatRows.length === 1) {
      handleImageFromUrl(`${process.env.REACT_APP_BASE_API_URL}/${selectedFlatRows[0].values.image}`);
    }
  }, [selectedFlatRows]);
  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="d-flex flex-column justify-content-between align-items-center mb-3">
              <ProductosImageUploader initialImages={productImage} setImageState={setProductImage} />
            </Col>
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
