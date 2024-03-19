import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { useGetResetPassTokenState } from 'hooks/Auth/useAuth';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserPassword } from 'store/slices/authThunk';
import { IconNotification } from 'components/notifications/IconNotification';

const ResetPassword = () => {
  const history = useHistory();
  const { resetToken } = useParams();
  const { data: resetPassTokenState, isLoading } = useGetResetPassTokenState({ resetToken });
  const dispatch = useDispatch();

  const title = 'Restablecer Contraseña';
  const description = 'Pagina para restablecer contraseña de usuario';
  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Debe tener al menos 6 caracteres').required('La contraseña es requerida'),
    passwordConfirm: Yup.string()
      .required('La confirmación de contraseña es requerida')
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben ser iguales.'),
  });
  const initialValues = { password: '', passwordConfirm: '' };
  const onSubmit = async ({ password }) => {
    const { status, message } = await dispatch(
      updateUserPassword({
        password,
        user_id: resetPassTokenState.user_id,
        resetToken,
      })
    );
    if (status) {
      toast(<IconNotification title="Contraseña Actualizada" description={message} toastType="success" />, { className: 'success' });
      history.push('/login');
    } else {
      toast(<IconNotification title="Problema Encontrado" description={message} toastType="danger" />, { className: 'danger' });
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
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una experiencia
            exclusiva y descubre un mundo de belleza hecho a tu medida
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
          <h2 className="cta-1 mb-0 text-primary">¿Problemas con la contraseña?</h2>
          <h2 className="cta-1 text-primary">¡Renuevala aquí!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Utiliza el siguiente formulario para restablecer tu contraseña.</p>
        </div>
        <div>
          <form id="resetForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Contraseña" />
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <div className="mb-3 filled">
              <CsLineIcons icon="lock-on" />
              <Form.Control type="password" name="passwordConfirm" onChange={handleChange} value={values.passwordConfirm} placeholder="Confirmar Contraseña" />
              {errors.passwordConfirm && touched.passwordConfirm && <div className="d-block invalid-tooltip">{errors.passwordConfirm}</div>}
            </div>
            <Button size="lg" type="submit">
              Restablecer Contraseña
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (!isLoading && resetPassTokenState) {
      if (!resetPassTokenState.status) {
        history.push('/login');
        const Content = () => (
          <>
            <div className="mb-2">
              <CsLineIcons icon="notification" width="20" height="20" className="cs-icon icon text-danger me-3 align-middle" />
              <span className="align-middle text-danger heading font-heading">El token expiró!</span>
            </div>
            <div className="text-muted mb-2">Token de email no es correcto</div>
          </>
        );

        toast(<Content />, { className: 'danger' });
      }
    }
  }, [isLoading, resetPassTokenState]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default ResetPassword;
