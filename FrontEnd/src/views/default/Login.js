import React, { useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { useDispatch } from 'react-redux';
import { loginUsuario } from 'store/slices/authThunk';

const Login = () => {
  const title = 'Login';
  const description = 'Login Page';
  const dispatch = useDispatch();
  const history = useHistory();
  const formikRef = useRef();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('El correo es requerido'),
    password: Yup.string().min(6, 'Debe tener al menos 6 caracteres!').required('La contraseña es requerida'),
  });
  const initialValues = { email: '', password: '' };

  const onSubmit = async (loginData) => {
    const result = await dispatch(loginUsuario(loginData));
    if(result.isLogin){
      history.push('/dashboard');
    }
    formikRef.current.setFieldError('password', result.message);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  formikRef.current = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">Maye Beauty Salón</h1>
            <h1 className="display-3 text-white">Refleja tu belleza interior</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5"> Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una experiencia exclusiva
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
          <h2 className="cta-1 mb-0 text-primary">Bienvenido,</h2>
          <h2 className="cta-1 text-primary">empecemos!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Inicia sesión para acceder a tu cuenta.</p>
          <p className="h6">
            ¿Aún no tienes una cuenta?, por favor <NavLink to="/register">Registrate aquí</NavLink>.
          </p>
        </div>
        <div>
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                Olvidaste tu contraseña?
              </NavLink>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <Button size="lg" type="submit">
              Iniciar sesión
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

export default Login;
