import React, { useCallback, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { ErrorMessage, Field, Formik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { baseApi } from 'api/apiConfig';

export const SecondDataRequestTap = ({ formRef }) => {
  const { formatMessage: f } = useIntl();
  const [initialValues, setInitialValues] = useState({
    id_card: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })
  const [userIdCard, setUserIdCard] = useState();
  const [userPrefilled, setuserPrefilled] = useState(false)





  const validationSchema = useMemo(() => Yup.object().shape({
    name: Yup.string().required(f({ id: 'services.serviceNameRequired' })).min(3, f({ id: 'services.serviceNameMinLength' })).max(20, f({ id: 'services.serviceNameMaxLength' })),
    price: Yup.number().required(f({ id: 'services.servicePriceRequired' })).typeError(f({ id: 'services.servicePriceType' })).positive(f({ id: 'services.servicePricePositive' }))
  }),[f])

  const onIdCardChange = useCallback(async (id_card) => {
    if(id_card.length > 7){
      const { data } = await baseApi.post('/appointments/user-prefill', { id_card });
      const { userPrefillData } = data;
      console.log('useGetPrefillData', )
      if (userPrefillData.length) {
        setInitialValues(userPrefillData[0]);
        setuserPrefilled(true)
      } else {
        setInitialValues({
          id_card,
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        })
        setuserPrefilled(false)
      }
    }
  }, [])


  return (
    <Formik
      innerRef={formRef[1]}
      initialValues={initialValues}
      validateOnMount
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={() => {}}
    >
      {({ errors, touched }) => (
        <Form>
          <h5 className="card-title">Second Title</h5>
          <p className="card-text text-alternate mb-4">Pastry wafer icing icing marshmallow dessert jelly-o apple pie lollipop.</p>
          <div className='w-30 mb-3'>
            <div className="mb-3">
              <Form.Label>{f({ id: 'services.serviceName' })}</Form.Label>
              <Field className="form-control w-40" value={userIdCard} onChange={(e) => onIdCardChange(e.target.value)} id='id_card' name='id_card'/>
              <ErrorMessage className='text-danger' name='id_card' component="div" />
            </div>
            <div className="d-flex gap-3 mb-3">
            <div className=" w-100">
                <Form.Label>{f({ id: 'services.serviceName' })}</Form.Label>
                <Field className="form-control" id='first_name' name='first_name' disabled={userPrefilled}/>
                <ErrorMessage className='text-danger' name='first_name' component="div" />
              </div>
              <div className="w-100">
                <Form.Label>{f({ id: 'services.serviceName' })}</Form.Label>
                <Field className="form-control" id='last_name' name='last_name' disabled={userPrefilled}/>
                <ErrorMessage className='text-danger' name='last_name' component="div" />
              </div>
            </div>
            <div className="mb-3">
              <Form.Label>{f({ id: 'services.serviceName' })}</Form.Label>
              <Field className="form-control w-60" id='phone' name='phone' disabled={userPrefilled}/>
              <ErrorMessage className='text-danger' name='phone' component="div" />
            </div>
            <div >
              <Form.Label>{f({ id: 'services.serviceName' })}</Form.Label>
              <Field className="form-control" id='email' name='email' disabled={userPrefilled}/>
              <ErrorMessage className='text-danger' name='email' component="div" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}