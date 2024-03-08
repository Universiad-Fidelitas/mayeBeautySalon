import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ErrorMessage, Field, Formik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { baseApi } from 'api/apiConfig';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setCustumerInfo } from 'store/appointments/appointmentsSlice';

export const SecondDataRequestTap = ({ formRef }) => {
  const dispatch = useDispatch();
  const { custumerInfo } = useSelector((state) => state.appointments);
  const { formatMessage: f } = useIntl();
  const [initialValues, setInitialValues] = useState({
    id_card: custumerInfo ? custumerInfo.id_card : '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })
  const [userIdCard, setUserIdCard] = useState();
  const [userPrefilled, setuserPrefilled] = useState(false);
  const [showUserInfo, setshowUserInfo] = useState(false);

  useEffect(() => {
    console.log('custumerInfomAU', custumerInfo)
    if (custumerInfo.length) {
      setUserIdCard(custumerInfo.id_card)
      setInitialValues(custumerInfo)
      setuserPrefilled(true)
      setshowUserInfo(true)
    }
  }, [custumerInfo])



  const validationSchema = useMemo(() => Yup.object().shape({
    first_name: Yup.string().required(f({ id: 'services.serviceNameRequired' })).min(3, f({ id: 'services.serviceNameMinLength' })).max(20, f({ id: 'services.serviceNameMaxLength' })),
    last_name: Yup.string().required(f({ id: 'services.serviceNameRequired' })).min(3, f({ id: 'services.serviceNameMinLength' })).max(20, f({ id: 'services.serviceNameMaxLength' })),
    // id_card: Yup.string()
    // .required('Costa Rican ID number is required')
    // .matches(/^\d+$/, 'Costa Rican ID number must contain only numbers')
    // .min(9, 'Costa Rican ID number must be at least 9 digits')
    // .max(12, 'Costa Rican ID number must be at most 12 digits'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d+$/, 'El teléfono debe ser un número')
      .min(8, 'El teléfono debe tener al menos 8 números')
      .max(10, 'El teléfono no puede tener más de 10 números')
      .required('El teléfono es requerido'),

  }),[f])

  const onSearchUser = useCallback(async () => {
    if(userIdCard && userIdCard.length > 7){
      const { data } = await baseApi.post('/appointments/user-prefill', { id_card: userIdCard });
      const { userPrefillData } = data;
      console.log('useGetPrefillData', )
      if (userPrefillData.length) {
        setInitialValues(userPrefillData[0]);
        setuserPrefilled(true)
      } else {
        setInitialValues({
          id_card: userIdCard,
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        })
        setuserPrefilled(false)
      }
      setshowUserInfo(true)
    }
  }, [userIdCard])
console.log(userIdCard, 'userIdCard')

  return (
    <Formik
      innerRef={formRef[0]}
      initialValues={initialValues}
      validateOnMount
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => {
        console.log('SUBMITmau', values)
        dispatch(setCustumerInfo(values));
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <h5 className="card-title">Second Title</h5>
          <p className="card-text text-alternate mb-4">Pastry wafer icing icing marshmallow dessert jelly-o apple pie lollipop.</p>
          <div className='w-30 mb-3'>
            <div className="mb-3">
              <Form.Label>Cedúla</Form.Label>
              <div className="d-flex gap-2">
                <Field className="form-control w-40" value={userIdCard} onChange={(e) => setUserIdCard(e.target.value)} id='id_card' name='id_card'/>
                <Button variant="outline-primary" onClick={onSearchUser}>
                  Obtener datos
                </Button>
              </div>
              <ErrorMessage className='text-danger' name='id_card' component="div" />
            </div>
            {
              showUserInfo && (
                <>
                  <div className="d-flex gap-3 mb-3">
                    <div className=" w-100">
                      <Form.Label>Nombre</Form.Label>
                      <Field className="form-control" id='first_name' name='first_name' disabled={userPrefilled}/>
                      <ErrorMessage className='text-danger' name='first_name' component="div" />
                    </div>
                    <div className="w-100">
                      <Form.Label>Apellido</Form.Label>
                      <Field className="form-control" id='last_name' name='last_name' disabled={userPrefilled}/>
                      <ErrorMessage className='text-danger' name='last_name' component="div" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Field className="form-control w-60" id='phone' name='phone' disabled={userPrefilled}/>
                    <ErrorMessage className='text-danger' name='phone' component="div" />
                  </div>
                  <div >
                    <Form.Label>Email</Form.Label>
                    <Field className="form-control" id='email' name='email' disabled={userPrefilled}/>
                    <ErrorMessage className='text-danger' name='email' component="div" />
                  </div>
                </>
              )
            }

          </div>
        </Form>
      )}
    </Formik>
  )
}