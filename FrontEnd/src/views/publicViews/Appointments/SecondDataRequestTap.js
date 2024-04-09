import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { baseApi } from 'api/apiConfig';
import { useDispatch, useSelector } from 'react-redux';

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

  return (
    <>
      <h5 className="card-title">{f({ id: 'appointments.SecondTaptitle' })}</h5>
      <p className="card-text text-alternate mb-4">{f({ id: 'appointments.SecondTapDescription' })}</p>

      <Formik initialValues={{ id_card: '' }} onSubmit={onCustomerFinder} validationSchema={validationSchemaCard}>
        <Form>
          <div className="w-30 mb-3">
            <label className="form-label">{f({ id: 'helper.idcard' })}</label>
            <div className="d-flex gap-2">
              <Field className="form-control w-40" id="id_card" name="id_card" disabled={isFindingCustomer} />
              <Button variant="outline-primary" type="submit" disabled={isFindingCustomer}>
                {isFindingCustomer ? (
                  <Spinner size="sm" animation="border" variant="primary" className="m-0" />
                ) : (
                  <span>{f({ id: 'appointments.findUserInformation' })}</span>
                )}
              </Button>
            </div>
            <ErrorMessage className="text-danger" name="id_card" component="div" />
          </div>
        </Form>
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
          <Form>
            <div className="w-30 mb-3">
              <div className="d-flex gap-3 mb-3">
                <div className=" w-100">
                  <label className="form-label">{f({ id: 'helper.name' })}</label>
                  <Field className="form-control" id="first_name" name="first_name" disabled={userPrefilled} />
                  <ErrorMessage className="text-danger" name="first_name" component="div" />
                </div>
                <div className="w-100">
                  <label className="form-label">{f({ id: 'helper.lastname' })}</label>
                  <Field className="form-control" id="last_name" name="last_name" disabled={userPrefilled} />
                  <ErrorMessage className="text-danger" name="last_name" component="div" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">{f({ id: 'helper.phone' })}</label>
                <Field className="form-control w-60" id="phone" name="phone" disabled={userPrefilled} />
                <ErrorMessage className="text-danger" name="phone" component="div" />
              </div>
              <div>
                <label className="form-label">{f({ id: 'helper.email' })}</label>
                <Field className="form-control" id="email" name="email" disabled={userPrefilled} />
                <ErrorMessage className="text-danger" name="email" component="div" />
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};
