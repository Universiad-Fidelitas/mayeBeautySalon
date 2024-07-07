import React from 'react';
import { NavLink } from 'react-router-dom';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const { isLogin } = useSelector((state) => state.auth);
  const title = '404 No Encontrado';
  const description = '404 No Encontrado Page';

  const rightSide = (
    <div className="sw-lg-80 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-60 px-5">
        <div className="sh-11">
          <NavLink to="/">
            <div className="logo-default" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">¡Ups, parece que ha ocurrido un error!</h2>
          <h2 className="display-2 text-primary">404 No Encontrado</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Parece que la página que estás buscando no está disponible.</p>
          <p className="h6">
          Si crees que esto es un error, por favor contáctanos.
          </p>
        </div>
        <div>
          <NavLink to={ isLogin ? '/dashboard' : '/'} className="btn btn-icon btn-icon-start btn-primary">
            <CsLineIcons icon="arrow-left" /> <span>Volver a Inicio</span>
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage right={rightSide} />
    </>
  );
};

export default NotFound;
