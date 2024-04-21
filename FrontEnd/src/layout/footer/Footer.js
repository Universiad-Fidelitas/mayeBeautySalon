import React from 'react';
import { Col } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Footer = () => {
  const { isLogin } = useSelector((state) => state.auth);
  return (
    <footer className="bg-primary text-light">
      { !isLogin && (
        <Col className="col-12 general-padding-x">
          <Col className="col-12 px-0 py-3 border-bottom border-white d-flex">
            <Col className="col-6 col-lg-2 p-0">Síguenos en redes sociales</Col>
            <Col className="col-6 col-lg-10 p-0 d-flex gap-2">
              <a className="text-light" href="https://www.instagram.com/maye_beautysalon/">
                <CsLineIcons icon="instagram" />
              </a>
              <a className="text-light" href="https://www.instagram.com/maye_beautysalon/">
                <CsLineIcons icon="facebook" />
              </a>
            </Col>
          </Col>

          <Col className="col-12 px-0 py-3 gap-5 d-flex pt-5 flex-column flex-lg-row">
            <Col className="col-12 col-lg-3 p-0">
              <h6 className="text-uppercase fw-bold mb-4">Maye Beauty Salón</h6>
              <p className="mb-0">
                Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una
                experiencia exclusiva y descubre un mundo de belleza hecho a tu medida
              </p>
            </Col>

            <Col className="col-12 col-lg-4 p-0">
              <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
              <p>
                <CsLineIcons icon="building" /> Centro Comercial Plaza Ayarco Sur local #12, Curridabat, San José, Costa Rica
              </p>
              <p>
                <CsLineIcons icon="phone" /> +506 7284 0695
              </p>
            </Col>
          </Col>
        </Col>
      )}
      <Col className="col-12 px-0 bg-secondary text-center py-3 text-dark copyright-footer">© 2024 Copyright | Maye Beauty Salon</Col>
    </footer>
  );
};
