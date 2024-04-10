import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const Footer = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-footer', 'true');
    return () => {
      document.documentElement.removeAttribute('data-footer');
    };
  }, []);

  return (
    <footer className="p-0" style={{ height: '165px' }}>
      <div className="footer-content d-flex justify-content-evenly">
        <Container className="g-3 d-flex row">
          <Row>
            <div className="d-flex d-flex justify-content-evenly">
              <Col sm="6">
                <div className="d-flex d-flex align-items-center flex-column">
                  <div className="mb-0 fs-4 mt-5 text-primary">Maye Beauty Salon</div>
                  <div className="mb-0 text-muted fs-6">Especialistas en el cuidado y tratamientos de cabello</div>
                  <div className="mb-0 text-muted fs-6"> Servicios de manicure y pedicure</div>
                </div>
              </Col>
              <Col sm="6">
                <div className="d-flex d-flex align-items-center flex-column">
                  <div className="mb-0 fs-4 mt-5 text-primary">Contacto</div>
                  <div className="d-flex d-flex justify-content-right">
                    <CsLineIcons icon="instagram" size="20" className="text-secondary pt-1" />
                    <a href="https://www.instagram.com/maye_beautysalon/" target="_blank" rel="noreferrer">
                      <p className="mb-0 text-muted fs-6">| maye_beautysalon</p>
                    </a>
                  </div>
                  <div className="d-flex d-flex justify-content-right">
                    <CsLineIcons icon="compass" size="20" className="text-secondary pt-1" />
                    <a
                      href="https://www.google.com/maps/place/Plaza+Lomas+de+Ayarco/@9.9093664,-84.0177188,19z/data=!4m6!3m5!1s0x8fa0e3d8c8bed48f:0xe2b4ec8faab60d80!8m2!3d9.9097116!4d-84.0186472!16s%2Fg%2F11b5pm147l?entry=ttu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="mb-0 text-muted fs-6 text-alternate">| Centro Comercial Plaza Ayarco Sur local #12</div>
                    </a>
                  </div>
                  <div className="d-flex d-flex justify-content-right align-items-stretch">
                    <CsLineIcons icon="phone" size="20" className="text-secondary pt-1" />
                    <a
                      href="https://api.whatsapp.com/send/?phone=50672840695&text=Gracias+por+comunicarte+con+maye+beauty+salon+%C2%BFcomo+podemos+ayudarte%3F%0A&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="mb-0 text-muted fs-6">| +506 7284 0695</div>
                    </a>
                  </div>
                </div>
              </Col>
            </div>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
