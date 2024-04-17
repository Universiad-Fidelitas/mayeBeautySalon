import React from 'react';
import { Col } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-primary text-light">
      <Col className='col-12 general-padding-x'>
        <Col className="col-12 px-0 py-3 border-bottom border-white d-flex">
          <Col className='col-6 col-lg-2 p-0'>Siguenos en redes sociales</Col>
          <Col className='col-6 col-lg-10 p-0 d-flex gap-2'>
            <Link className="text-light" to="/dashboard">
              <CsLineIcons icon="instagram" />
            </Link>
            <Link className="text-light" to="/dashboard">
              <CsLineIcons icon="facebook" />
            </Link>
          </Col>
        </Col>

        <Col className="col-12 px-0 py-3 gap-5 d-flex pt-5 flex-column flex-lg-row">
          <Col className="col-12 col-lg-3 p-0">
            <h6 className="text-uppercase fw-bold mb-4">Maye Beauty Salón</h6>
            <p className='mb-0'>Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una experiencia exclusiva y descubre un mundo de belleza hecho a tu medida</p>
          </Col>

          <Col className="col-12 col-lg-4 p-0">
            <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
            <p><CsLineIcons icon="building"/> Heredia, Costa Rica</p>
            <p><CsLineIcons icon="email"/> info@mayebeautysalon.com</p>
            <p><CsLineIcons icon="phone"/> +506 8383-0353</p>
          </Col>
        </Col>
      </Col>
      <Col className="col-12 px-0 bg-secondary text-center py-3 text-dark copyright-footer">© 2024 Copyright | Proyecto de graduación</Col>
    </footer>
  );
};