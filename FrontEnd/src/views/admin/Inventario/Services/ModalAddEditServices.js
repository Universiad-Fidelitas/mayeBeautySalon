import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, FormCheck, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useServices } from 'hooks/react-query/useServices';
import { useIntl } from 'react-intl';

export const ModalAddEditServices = ({ tableInstance, apiParms }) => {
    const { formatMessage: f } = useIntl();
    const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
    const initialValues = selectedFlatRows.length === 1 ? selectedFlatRows[0].values : { name: '', duration: '', price: ''};

    const [estadoState, setEstadoState] = useState(true);
    const [hoursState, setHoursState] = useState();
    const [minutesState, setMinutesState] = useState();

    const generateMinuteOptions = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ value: i, label: i })),[]);
    const generateHourOptions = useMemo(() => Array.from({ length: 13 }, (_, i) => ({ value: i, label: i })),[]);
    const { addServices, updateServices } = useServices(apiParms);

    useEffect(() => {
        if(selectedFlatRows.length !== 1){
            setEstadoState(true);
            setHoursState(null);
            setMinutesState(null);
        } else {
            setEstadoState(selectedFlatRows[0].values.activated);
            setHoursState({ value: selectedFlatRows[0].values.duration.split('.')[0], label: selectedFlatRows[0].values.duration.split('.')[0]});
            setMinutesState({ value: selectedFlatRows[0].values.duration.split('.')[1], label: selectedFlatRows[0].values.duration.split('.')[1]});
        }
    }, [selectedFlatRows])
    
    const validationSchema = useMemo(() => Yup.object().shape({
      name: Yup.string().required(f({ id: 'services.serviceNameRequired' })).min(3, f({ id: 'services.serviceNameMinLength' })).max(20, f({ id: 'services.serviceNameMaxLength' })),
      price: Yup.number().required(f({ id: 'services.servicePriceRequired' })).typeError(f({ id: 'services.servicePriceType' })).positive(f({ id: 'services.servicePricePositive' }))
    }),[f])
    
  
    const onSubmit = (values) => {
      if (selectedFlatRows.length === 1) {
        updateServices.mutateAsync({ ...values, activated: estadoState, duration: `${hoursState.value}.${minutesState.value}`})
      } else {
        addServices.mutateAsync({ ...values, activated: estadoState, duration: `${hoursState.value}.${minutesState.value}`})
      }
      setIsOpenAddEditModal(false);
    };
    

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      <Form>
        <Modal.Header>
          <Modal.Title>{selectedFlatRows.length === 1 ? f({ id: 'helper.edit' }) : f({ id: 'helper.add' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="mb-3 d-flex flex-row justify-content-between align-items-center">
                <label className="form-label">{f({ id: 'services.serviceState' })}</label>
                <FormCheck className="form-check" type="switch" checked={ estadoState } onChange={() => setEstadoState(!estadoState)}/>
            </div>
            <div className="mb-3">
                <label className="form-label">{f({ id: 'services.serviceName' })}</label>
                <Field className="form-control" id='name' name='name'/>
                <ErrorMessage className='text-danger' name='name' component="div" />
            </div>
            <div className="mb-3">
                <label className="form-label">{f({ id: 'services.serviceTime' })}</label>
                <div className="d-flex flex-row gap-3">
                  <Select className='w-50' classNamePrefix="react-select" options={generateHourOptions} value={hoursState} onChange={setHoursState} placeholder={f({ id: 'services.hours' })} />
                  <Select className='w-50' classNamePrefix="react-select" options={generateMinuteOptions} value={minutesState} onChange={setMinutesState} placeholder={f({ id: 'services.minutes' })} />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">{f({ id: 'services.servicePrice' })}</label>
                <Field className="form-control" id='price' name='price'/>
                <ErrorMessage className='text-danger' name='price' component="div" />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
            {f({ id: 'helper.cancel' })}
          </Button>
          <Button variant="primary" type="submit">
            {selectedFlatRows.length === 1 ? f({ id: 'helper.done' }) : f({ id: 'helper.add' })}
          </Button>
        </Modal.Footer>
      </Form>
    </Formik>
  </Modal>
  )
}