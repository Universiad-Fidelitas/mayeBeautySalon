import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { baseApi } from 'api/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import { SelectField } from 'components/SelectField';

export const SecondDataRequestTap = ({ formRef }) => {
  const dispatch = useDispatch();
  const { formatMessage: f } = useIntl();
  const [initialValues, setInitialValues] = useState({
    id_card: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [userPrefilled, setuserPrefilled] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [isFindingCustomer, setIsFindingCustomer] = useState(false);

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
      }),
    [f]
  );

  const validationSchemaCard = useMemo(
    () =>
      Yup.object().shape({
        id_card: Yup.string()
          .required(f({ id: 'helper.idCardRequired' }))
          .matches(/^\d+$/, f({ id: 'helper.idCardOnlyNumbers' }))
          .min(9, f({ id: 'helper.idCardMinSize' }))
          .max(12, f({ id: 'helper.idCardMaxSize' })),
        id_card_type: Yup.string().required('Tipo de documento requerido'),
      }),
    [f]
  );

  const onSearchUser = useCallback(
    async (id_card) => {
      setIsFindingCustomer(true);
      const { data } = await baseApi.post('/appointments/user-prefill', { id_card });
      const { userPrefillData } = data;
      if (userPrefillData.length) {
        setInitialValues(userPrefillData[0]);
        setuserPrefilled(true);
        setIsFindingCustomer(false);
        setShowUserInfoForm(true);
      } else {
        setInitialValues({
          id_card,
          id_card_type: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
        setIsFindingCustomer(false);
        setuserPrefilled(false);
        setShowUserInfoForm(true);
      }
    },
    [setIsFindingCustomer, setInitialValues, setuserPrefilled]
  );

  const onCustomerFinder = useCallback(
    ({ id_card }) => {
      onSearchUser(id_card);
    },
    [onSearchUser]
  );

  const onFormSubmit = useCallback(() => {
    console.log('first')
  }, [initialValues, dispatch]);

  const idTypeDropdown = useMemo(() => {
    return [
      { value: 'nacional', label: 'Nacional' },
      { value: 'extranjero', label: 'Extranjero' },
    ];
  }, []);

  return (
    <div className='mb-5 mt-5'>
      <Row className="mb-3 mt-5">
        <h2 className="medium-title text-primary font-weight-bold m-0 text-center">Información del Cliente</h2>
        <p className="card-text m-0 text-center">Por favor, complete la información del cliente</p>
      </Row>

      <Formik initialValues={{ id_card: '', id_card_type: '' }} onSubmit={onCustomerFinder} validationSchema={validationSchemaCard}>
      {({ errors, touched, setFieldValue, values }) => (
        <Form>
          <Row className='justify-content-center'>
            <Col className="col-12 col-lg-4">
              <Row className="mb-3">
                <Col className="col-12">
                    <SelectField
                      label={f({ id: 'helper.idcardtype' })}
                      name="id_card_type"
                      placeholder={f({ id: 'helper.selectIdCardType' })}
                      options={idTypeDropdown}
                      isError={errors.id_card_type && touched.id_card_type}
                    />
                </Col>
                
                <Row>
                  <Col className="col-6">
                    <div className="top-label">
                        <label className="form-label bg-transparent">{f({ id: 'helper.name' })}</label>
                        <NumberFormat
                          className="form-control"
                          mask="_"
                          format={values.id_card_type && values.id_card_type !== 'nacional' ? '####-####-####' : '#-####-####'}
                          allowEmptyFormatting
                          value={values.id_card}
                          onValueChange={({ value }) => {
                            setFieldValue('id_card', value);
                          }}
                        />
                    </div>    
                  </Col>
                  <Col className="col-6">
                    <Button variant="outline-primary h-100 w-100" type="submit" disabled={isFindingCustomer}>
                      {isFindingCustomer ? (
                        <Spinner size="sm" animation="border" variant="primary" className="m-0" />
                      ) : (
                        <span>Buscar Información</span>
                      )}
                    </Button>
                  </Col>
                  <ErrorMessage className="text-danger" name="id_card" component="div" />
                </Row>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
      </Formik>
      {showUserInfoForm && (
        <Formik
          innerRef={formRef[1]}
          validateOnMount
          initialValues={initialValues}
          onSubmit={onFormSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
          <Form>
          <Row className='justify-content-center'>
              <Col className="col-12 col-lg-4">
                <hr/>
                <h2 className="medium-title text-primary font-weight-bold mb-3">Información del cliente</h2>
                <Row className="g-3 mb-3">
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label bg-transparent">{f({ id: 'helper.name' })}</label>
                      <Field className="form-control" id="first_name" name="first_name" disabled={userPrefilled} />
                      <ErrorMessage className="text-danger" name="first_name" component="div" />
                    </div>
                  </Col>
                  <Col className="col-6">
                    <div className="top-label">
                      <label className="form-label bg-transparent">{f({ id: 'helper.lastname' })}</label>
                      <Field className="form-control" id="last_name" name="last_name" disabled={userPrefilled} />
                      <ErrorMessage className="text-danger" name="last_name" component="div" />
                    </div>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col className="col-4">
                    <div className="top-label">
                      <label className="form-label bg-transparent">{f({ id: 'helper.phone' })}</label>
                      {/* <Field className="form-control" id="phone" name="phone" disabled={userPrefilled} /> */}
                      <NumberFormat
                        className="form-control"
                        mask="_"
                        format="####-####"
                        disabled={userPrefilled}
                        allowEmptyFormatting
                        value={values.phone}
                        onValueChange={({ value }) => {
                          setFieldValue('phone', value);
                        }}
                      />
                      <ErrorMessage className="text-danger" name="phone" component="div" />
                    </div>
                  </Col>
                  <Col className="col-8">
                    <div className="top-label">
                      <label className="form-label bg-transparent">{f({ id: 'helper.email' })}</label>
                      <Field className="form-control" id="email" name="email" disabled={userPrefilled} />
                      <ErrorMessage className="text-danger" name="email" component="div" />
                    </div>
                  </Col>
                </Row>
                
              </Col>
            </Row>
          </Form>
        )}
        </Formik>
      )}
    </div>
  );
};
