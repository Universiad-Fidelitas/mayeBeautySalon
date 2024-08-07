import React from 'react';
import { Col, Row, Card, Accordion, useAccordionButton, Button } from 'react-bootstrap';
import Scrollspy from 'components/scrollspy/Scrollspy';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import HtmlHead from 'components/html-head/HtmlHead';

function CustomAccordionToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});

  return (
    <Card.Body className="py-4" onClick={decoratedOnClick} role="button">
      <Button variant="link" className="list-item-heading p-0">
        {children}
      </Button>
    </Card.Body>
  );
}

export const Tutoriales = () => {
  return (
    <>
      <Row>
        <Col>
          <section className="scroll-section">
            <h2 className="big-title text-primary mb-3 font-weight-bold">¿Cómo usar la plataforma?</h2>
            <Accordion className="mb-n2" defaultActiveKey="1">
              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="1">¿Cómo agendar citas?</CustomAccordionToggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className='tutoriales-video-wrapper pt-0'>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/t6pTwKRVBFA?si=BZufFIPFMVsTG00i" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="2">Facturas y Pagos</CustomAccordionToggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/VZMdJ4rml8w?si=1ZcYbo_yXLnaNrLv" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="3">Administrar Inventario, Movimientos de Inventario y Notificaciones</CustomAccordionToggle>
                <Accordion.Collapse eventKey="3">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/2Dh2ZkiaY1E?si=p6jCAOF_pEycRgc4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="4">Administrar Gastos</CustomAccordionToggle>
                <Accordion.Collapse eventKey="4">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/GByQE-88hZ4?si=B8E2I9c42aam-u5w" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="5">Personalizar la plataforma</CustomAccordionToggle>
                <Accordion.Collapse eventKey="5">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/8FUFY76sLdM?si=0kjlcwapwZU6MVUP" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="6">Administrar Categorías, Marcas, Proveedores y Productos</CustomAccordionToggle>
                <Accordion.Collapse eventKey="6">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/4yqdytvsbVo?si=QKcmDlhn9cw8GpIZ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="7">Administrar Servicios</CustomAccordionToggle>
                <Accordion.Collapse eventKey="7">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/lXSu5_UIYsA?si=8GDjGOsfIw3_zb6c" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="8">Administrar Citas Admin</CustomAccordionToggle>
                <Accordion.Collapse eventKey="8">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/OwL3npcJiSc?si=wougIBuHlgtNqbY7" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="9">Restablecer Contraseña</CustomAccordionToggle>
                <Accordion.Collapse eventKey="9">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/t5SSxYVP0yg?si=xDXrwWzUiQ_qFRoC" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="d-flex mb-2 flex-grow-1">
                <CustomAccordionToggle eventKey="10">Administrar Roles y usuarios</CustomAccordionToggle>
                <Accordion.Collapse eventKey="10">
                  <Card.Body className="pt-0 tutoriales-video-wrapper">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/pbPOv8SCRSo?si=WNVhiySxMzh8D7dw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen/>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </section>
          {/* Accordion Cards End */}
        </Col>

      </Row>
    </>
  );
};


