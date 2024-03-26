import React, { createRef, useMemo, useState } from 'react';
import HtmlHead from 'components/html-head/HtmlHead';
import useCustomLayout from 'hooks/useCustomLayout';
import { Wizard, Steps, Step, WithWizard } from 'react-albus';
import { Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { baseApi } from 'api/apiConfig';
import { FirstDataRequestTap } from './Appointments/FirstDataRequestTap';
import { SecondDataRequestTap } from './Appointments/SecondDataRequestTap';
import { MENU_PLACEMENT } from '../../constants';
import { ThanksTap } from './Appointments/ThanksTap';

export const AppointmentsClient = () => {
  const title = 'Horizontal Menu';
  const description = 'Horizontal standard menu that turns into mobile menu for smaller screens.';
  const forms = [createRef(null), createRef(null)];
  const [bottomNavHidden, setBottomNavHidden] = useState(false);
  const [fields, setFields] = useState(false);
  const [savingData, setSavingData] = useState();
  const { formatMessage: f } = useIntl();
  const custumerInfo = useSelector((state) => state.appointments);

  const isNextAble = useMemo(() => {
    const { selectedService, appointmentDateTime } = custumerInfo.selectedAppointments;
    console.log('custumerInfo', selectedService && appointmentDateTime);
    if (selectedService && appointmentDateTime) {
      return false;
    }
    return true;
  }, [custumerInfo]);

  const onClickNext = (goToNext, steps, step) => {
    if (steps.length - 1 <= steps.indexOf(step)) {
      return;
    }
    const formIndex = steps.indexOf(step);
    const form = forms[formIndex].current;

    if (form) {
      form.submitForm().then(async () => {
        if (!form.isDirty && form.isValid) {
          const newFields = { ...fields, ...form.values };

          setFields(newFields);

          if (steps.length - 2 <= steps.indexOf(step)) {
            console.log('custumerInfo', { ...newFields, ...custumerInfo.selectedAppointments });
            const { data } = await baseApi.post('/appointments/save-appointment', { ...newFields, ...custumerInfo.selectedAppointments });
            setSavingData({
              isLoaded: true,
              ...data,
            });
            setBottomNavHidden(true);
          }
          goToNext();
          step.isDone = true;
        }
      });
    }
  };

  const onClickPrev = (goToPrev, steps, step) => {
    if (steps.indexOf(step) <= 0) {
      return;
    }
    goToPrev();
  };

  const getClassName = (steps, step, index, stepItem) => {
    if (steps.indexOf(step) === index) {
      return 'step-doing';
    }
    if (steps.indexOf(step) > index || stepItem.isDone) {
      stepItem.isDone = true;
      return 'step-done';
    }
    return 'step';
  };

  useCustomLayout({ placement: MENU_PLACEMENT.Horizontal });
  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="wizard wizard-default mt-3">
        <Wizard>
          <WithWizard
            render={({ step, steps }) => (
              <ul className="nav nav-tabs justify-content-center">
                {steps.map((stepItem, index) => {
                  if (!stepItem.hideTopNav) {
                    return (
                      <li key={`topNavStep_${index}`} className={`nav-item ${getClassName(steps, step, index, stepItem)}`}>
                        <Button variant="link" className="nav-link pe-none">
                          <span>{stepItem.name}</span>
                          <small>{stepItem.desc}</small>
                        </Button>
                      </li>
                    );
                  }
                  return <span key={`topNavStep_${index}`} />;
                })}
              </ul>
            )}
          />
          <Steps>
            <Step id="step1" name="Primer Paso" desc={f({ id: 'appointments.FirstTaptitle' })}>
              <FirstDataRequestTap formRef={forms} />
            </Step>
            <Step id="step2" name="Segundo Paso" desc="Información del cliente">
              <SecondDataRequestTap formRef={forms} />
            </Step>
            <Step id="step3" hideTopNav>
              <ThanksTap savingData={savingData} />
            </Step>
          </Steps>
          <WithWizard
            render={({ next, previous, step, steps }) => (
              <div className={`wizard-buttons d-flex justify-content-center ${bottomNavHidden && 'invisible'}`}>
                <Button
                  variant="outline-primary"
                  className={`btn-icon btn-icon-start me-1 ${steps.indexOf(step) <= 0 ? 'disabled' : ''}`}
                  onClick={() => {
                    onClickPrev(previous, steps, step);
                  }}
                >
                  <CsLineIcons icon="chevron-left" /> <span>{f({ id: 'helper.Back' })}</span>
                </Button>
                <Button
                  variant="outline-primary"
                  disabled={isNextAble}
                  className={`btn-icon btn-icon-end ${steps.indexOf(step) >= steps.length - 1 ? 'disabled' : ''}`}
                  onClick={() => {
                    onClickNext(next, steps, step);
                  }}
                >
                  <span>{f({ id: 'helper.Next' })}</span> <CsLineIcons icon="chevron-right" />
                </Button>
              </div>
            )}
          />
        </Wizard>
      </div>
    </>
  );
};
