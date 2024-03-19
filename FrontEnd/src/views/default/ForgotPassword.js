import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { useDispatch } from 'react-redux';
import { forgotPassword } from 'store/slices/authThunk';
import { IconNotification } from 'components/notifications/IconNotification';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const title = 'Forgot Password';
  const description = 'Forgot Password Page';
  const dispatch = useDispatch();
  const history = useHistory();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
  });
  const initialValues = { email: '' };
  const onSubmit = async ({ email }) => {
    const { status, message } = await dispatch(forgotPassword(email));
    if (status) {
      toast(<IconNotification title="Enlace enviado" description={message} toastType="success"/>, { className: 'success' });
      history.push('/login');
    } else {
      toast(<IconNotification title="No encontrado" description={message} toastType="danger"/>, { className: 'danger' });
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">Maye Beauty Salón</h1>
            <h1 className="display-3 text-white">Refleja tu belleza interior</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
           Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una experiencia exclusiva
           y descubre un mundo de belleza hecho a tu medida....
          </p>
          <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Conocer más
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11">
          <NavLink to="/">
            <div className="logo-default" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">¿Olvidaste tu contraseña?</h2>
          <h2 className="cta-1 text-primary">Recuperemosla!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Por favor ingresa tu correo electrónico para recibir un enlace para restablecer tu contraseña.</p>
          <p className="h6">
            Volver a la página de <NavLink to="/login">Inicio de Sesión</NavLink>.
          </p>
        </div>
        <div>
          <form id="forgotPasswordForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <Button size="lg" type="submit">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default ForgotPassword;
