import React, { useEffect, useMemo, useState } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import { useCategories } from 'hooks/react-query/useCategories';
import { useBrands } from 'hooks/react-query/useBrands';
import { useProviders } from 'hooks/react-query/useProviders';
import { ProductosImageUploader } from 'components/ImageUploading/ProductsImageUploader';

export const ModalAddEditProductos = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: categoriesData } = useCategories();
  const { data: providersData } = useProviders();
  const [productImage, setProductImage] = useState([]);
  let original;
  if (selectedFlatRows[0] && selectedFlatRows[0].original) {
    original = { ...selectedFlatRows[0].original };
    const { size } = original;
    const firstLetterIndex = size.search(/[a-zA-Z]/);
    if (firstLetterIndex !== -1) {
      original.size = size.substring(0, firstLetterIndex);
      original.size_m = size.substring(firstLetterIndex);
    }
  } else {
    console.log('selectedFlatRows[0] o selectedFlatRows[0].original es undefined');
  }

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
    values.size += values.size_m;
    delete values.size_m;
    const formData = new FormData();
    const productSchema = {
      ...values,
    };

    if (productImage[0]?.dataurl.startsWith('data:')) {
      Object.entries(productSchema).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });
      formData.append('image', productImage[0].file);
    } else {
      Object.entries(productSchema).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    if (selectedFlatRows.length === 1) {
      editItem({ formData, product_id: selectedFlatRows[0].original.product_id });
    } else {
      addItem(formData);
    }
    setProductImage([]);
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
    } else {
      setProductImage([]);
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    if (!isOpenAddEditModal) {
      setProductImage([]);
    }
  }, [isOpenAddEditModal]);
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
  const options = [
    { value: 'ml', label: 'ml' },
    { value: 'L', label: 'L' },
    { value: 'Unidad', label: 'Unidad' },
  ];
  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="d-flex flex-column justify-content-between align-items-center mb-3">
              <ProductosImageUploader initialImages={productImage} setImageState={setProductImage} />
            </Col>
            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} name={id} />
                <ErrorMessage style={{ color: 'red' }} name={id} component="div" />
              </div>
            ))}
            {categoryDataDropdown && brandDataDropdown && providerDataDropdown && (
              <>
                <div className="mb-3">
                  <label className="form-label">Categorias</label>

                  <Field className="form-control" id="category_id" name="category_id" component={CustomSelect} options={categoryDataDropdown} required />
                  <ErrorMessage style={{ color: 'red' }} name="category_id" component="div" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Marcas</label>
                  <Field className="form-control" id="brand_id" name="brand_id" component={CustomSelect} options={brandDataDropdown} required />
                  <ErrorMessage style={{ color: 'red' }} name="brand_id" component="div" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Proveedores</label>

                  <Field className="form-control" id="provider_id" name="provider_id" component={CustomSelect} options={providerDataDropdown} required />
                  <ErrorMessage style={{ color: 'red' }} name="provider_id" component="div" />
                </div>
              </>
            )}

            <div className="mb-3" key="size">
              <label className="form-label">Tamaño</label>
              <Row>
                <Col sm="6">
                  <Field className="form-control" type="text" id="size" name="size" />
                </Col>
                <Col sm="6">
                  <Field className="form-control" id="size_m" name="size_m" component={CustomSelect} options={options} required />
                </Col>
              </Row>

              <ErrorMessage style={{ color: 'red' }} name="size" component="div" />
            </div>
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
