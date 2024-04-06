import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { SelectField } from 'components/SelectField';
import { useProducts } from 'hooks/react-query/useProducts';
import { UploaderComponent } from 'components/imagesUploader/UploaderComponent';
import { useCategories } from 'hooks/react-query/useCategories';
import { useBrands } from 'hooks/react-query/useBrands';
import { useProviders } from 'hooks/react-query/useProviders';
import classNames from 'classnames';
import Select from 'react-select';
import NumberFormat from 'react-number-format';

export const ProductosModalAddEdit = ({ tableInstance, apiParms }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { updateProduct, addProduct } = useProducts(apiParms);

  const { getCategories } = useCategories({ term: '', sortBy: [], pageIndex: 0, pageSize: 100 });
  const { data: categoriesData } = getCategories;
  const { getBrands } = useBrands({ term: '', sortBy: [], pageIndex: 0, pageSize: 100 });
  const { data: brandsData } = getBrands;
  const { getProviders } = useProviders({ term: '', sortBy: [], pageIndex: 0, pageSize: 100 });
  const { data: providersData } = getProviders;

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
      if (selectedFlatRows.length === 1) {
        updateProduct.mutateAsync(formData);
      } else {
        addProduct.mutateAsync(formData);
      }
      setIsOpenAddEditModal(false);
    },
    [selectedFlatRows, setIsOpenAddEditModal, updateProduct, addProduct]
  );

  const initialValues = useMemo(
    () =>
      selectedFlatRows.length === 1
        ? {
            ...selectedFlatRows[0].values,
            image: [
              {
                dataurl: selectedFlatRows[0].values.image,
                file: null,
              },
            ],
          }
        : {
            image: '',
            name: '',
            price: '',
            price_buy: '',
            brand_id: '',
            category_id: '',
            provider_id: '',
            size: '',
          },
    [selectedFlatRows]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        image: Yup.mixed().required(f({ id: 'users.imageRequired' })),
        name: Yup.string()
          .required(f({ id: 'products.nameError.required' }))
          .min(3, f({ id: 'products.nameError.minLength' }))
          .max(20, f({ id: 'products.nameError.maxLength' })),
        brand_id: Yup.string().required(f({ id: 'products.brandError.required' })),
        provider_id: Yup.string().required(f({ id: 'products.providerError.required' })),
        category_id: Yup.string().required(f({ id: 'products.categoryError.required' })),
        price: Yup.number()
          .required(f({ id: 'products.priceError.required' }))
          .typeError(f({ id: 'products.priceError.typeError' }))
          .min(1, f({ id: 'products.priceError.minError' })),
        price_buy: Yup.number()
          .required(f({ id: 'products.buyPriceError.required' }))
          .typeError(f({ id: 'products.buyPriceError.typeError' }))
          .min(1, f({ id: 'products.buyPriceError.minError' })),

        size: Yup.string()
          .required(f({ id: 'products.amountError.required' }))
          .test('not-zero-point-zero', f({ id: 'products.amountError.notValid' }), (value) => {
            if (value) {
              return value.replace(parseInt(value, 10), '').length > 0 && parseInt(value, 10);
            }
            return false;
          }),
      }),
    [f]
  );

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
      providersData?.items.map(({ provider_id, name, email }) => {
        return { value: provider_id, label: `${name} | ${email}` };
      }),
    [providersData]
  );

  const sizeOptions = [
    { value: 'Mililitros', label: 'Mililitros' },
    { value: 'Litros', label: 'Litros' },
    { value: 'Unidades', label: 'Unidades' },
  ];

  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Card>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ errors, touched, dirty, setFieldValue, values }) => {
            console.log('initialValues', values.size.replace(parseInt(values.size, 10), ''));
            return (
              <Form>
                <Modal.Header>
                  <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="g-0 mb-6 d-flex justify-content-center">
                    <Col className="col-6 top-label products-uploader-component">
                      <UploaderComponent initialImages={values.image} isError={errors.image && touched.image} setFieldValue={setFieldValue} />
                    </Col>
                    <ErrorMessage className="text-danger text-center" name="image" component="div" />
                  </Row>

                  <Row className="g-3 mb-3">
                    <Col>
                      <div className="top-label">
                        <label className="form-label">{f({ id: 'products.productName' })}</label>
                        <Field className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} id="name" name="name" />
                        <ErrorMessage className="text-danger" name="name" component="div" />
                      </div>
                    </Col>
                  </Row>

                  <Row className="g-3 mb-3">
                    <Col className="col-6">
                      <div className="top-label">
                        <label className="form-label">{f({ id: 'products.productFinalPrice' })}</label>
                        <NumberFormat
                          className={classNames('form-control', { 'is-invalid': errors.price && touched.price })}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="₡"
                          allowNegative={false}
                          value={values.price}
                          onValueChange={({ value }) => {
                            setFieldValue('price', value);
                          }}
                        />
                        <ErrorMessage className="text-danger" name="price" component="div" />
                      </div>
                    </Col>
                    <Col className="col-6">
                      <div className="top-label">
                        <label className="form-label">{f({ id: 'products.productBuyPrice' })}</label>
                        <NumberFormat
                          className={classNames('form-control', { 'is-invalid': errors.price_buy && touched.price_buy })}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="₡"
                          allowNegative={false}
                          value={values.price_buy}
                          onValueChange={({ value }) => {
                            setFieldValue('price_buy', value);
                          }}
                        />
                        <ErrorMessage className="text-danger" name="price_buy" component="div" />
                      </div>
                    </Col>
                  </Row>

                  <Row className="g-3">
                    <Col className="col-8">
                      <SelectField
                        label={f({ id: 'products.providerInformation' })}
                        name="provider_id"
                        placeholder={f({ id: 'products.selectProvider' })}
                        options={providerDataDropdown}
                        isError={errors.provider_id && touched.provider_id}
                      />
                    </Col>
                  </Row>

                  <Row className="g-3">
                    <Col className="col-6">
                      <SelectField
                        label={f({ id: 'products.categoryInformation' })}
                        name="category_id"
                        placeholder={f({ id: 'products.selectCategory' })}
                        options={categoryDataDropdown}
                        isError={errors.category_id && touched.category_id}
                      />
                    </Col>
                    <Col className="col-6">
                      <SelectField
                        label={f({ id: 'products.brandInformation' })}
                        name="brand_id"
                        placeholder={f({ id: 'products.selectBrand' })}
                        options={brandDataDropdown}
                        isError={errors.brand_id && touched.brand_id}
                      />
                    </Col>
                  </Row>

                  <Row className="g-3 mb-3">
                    <Col className="col-4">
                      <div className="top-label">
                        <label>{f({ id: 'products.unitOfMeasurement' })}</label>
                        <Select
                          className={classNames(errors.size && touched.size && 'is-invalid')}
                          classNamePrefix="react-select"
                          options={sizeOptions}
                          value={{ value: values.size.replace(parseInt(values.size, 10), ''), label: values.size.replace(parseInt(values.size, 10), '') }}
                          onChange={({ value }) => setFieldValue('size', `${parseInt(values.size, 10)}${value}`)}
                          placeholder={f({ id: 'products.unitOfMeasurementPH' })}
                        />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <div className="top-label">
                        <label className="form-label">{f({ id: 'products.productAmount' })}</label>
                        <Field
                          value={parseInt(values.size, 10) ? parseInt(values.size, 10) : ''}
                          onChange={({ target }) => setFieldValue('size', `${target.value}${values.size.replace(parseInt(values.size, 10), '')}`)}
                          className={`form-control ${errors.size && touched.size ? 'is-invalid' : ''}`}
                          id="size"
                          name="size"
                        />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <div className="top-label">
                        <label className="form-label bg-transparent">{f({ id: 'products.totalAmount' })}</label>
                        <Field
                          className="form-control"
                          id="size"
                          name="size"
                          value={`${parseInt(values.size, 10) ? parseInt(values.size, 10) : 0} ${values.size.replace(parseInt(values.size, 10), '')}`}
                          disabled
                        />
                      </div>
                    </Col>
                    {errors.size && touched.size && <ErrorMessage className="text-danger m-0" name="size" component="div" />}
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
            );
          }}
        </Formik>
      </Card>
    </Modal>
  );
};
