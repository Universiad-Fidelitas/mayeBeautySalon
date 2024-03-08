import React, { createRef, useState } from 'react';
import HtmlHead from 'components/html-head/HtmlHead';
import useCustomLayout from 'hooks/useCustomLayout';
import { Wizard, Steps, Step, WithWizard } from 'react-albus';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { MENU_PLACEMENT } from '../../constants';
import { FirstDataRequestTap } from './Appointments/FirstDataRequestTap';
import { SecondDataRequestTap } from './Appointments/SecondDataRequestTap';

export const AppointmentsClient = () => {
    const title = 'Horizontal Menu';
    const description = 'Horizontal standard menu that turns into mobile menu for smaller screens.'
    const forms = [createRef(null), createRef(null)];
    const [bottomNavHidden, setBottomNavHidden] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(false);
  
    const onClickNext = (goToNext, steps, step) => {
      if (steps.length - 1 <= steps.indexOf(step)) {
        return;
      }
      const formIndex = steps.indexOf(step);
      const form = forms[formIndex].current;

  
      form.submitForm().then(() => {
        if (!form.isDirty && form.isValid) {
          const newFields = { ...fields, ...form.values };

          setFields(newFields);
      console.log('newFields', newFields)
  
          if (steps.length - 2 <= steps.indexOf(step)) {
            // done
            setBottomNavHidden(true);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          }
          goToNext();
          step.isDone = true;
        }
      });
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
        <div className="wizard wizard-default">
      <Wizard>
        <WithWizard
          render={({ next, previous, step, steps, go, push }) => (
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
          <Step id="step1" name="Primer Paso" desc="Elegir el servicio">


          <SecondDataRequestTap formRef={forms} />

          </Step>
          <Step id="step2" name="Segundo Paso" desc="Información del cliente">
          <FirstDataRequestTap formRef={forms}/>
          </Step>
          <Step id="step3" hideTopNav>
            <div className="sh-30 d-flex flex-column justify-content-center align-items-center">
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p>Creating account...</p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="mb-2">Thank You!</h3>
                  <p>Your registration completed successfully!</p>
                  <Button variant="primary" className="btn-icon btn-icon-end">
                    <span>Login</span> <CsLineIcons icon="user" />
                  </Button>
                </div>
              )}
            </div>
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
                <CsLineIcons icon="chevron-left" /> <span>Back</span>
              </Button>
              <Button
                variant="outline-primary"
                className={`btn-icon btn-icon-end ${steps.indexOf(step) >= steps.length - 1 ? 'disabled' : ''}`}
                onClick={() => {
                  onClickNext(next, steps, step);
                }}
              >
                <span>Next</span> <CsLineIcons icon="chevron-right" />
              </Button>
            </div>
          )}
        />
      </Wizard>
    </div>
    </>
  )
}
