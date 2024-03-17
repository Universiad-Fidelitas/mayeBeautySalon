import React from 'react';
import { Button, Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

export const CardReport = ({ formFields }) => {
  console.log('karo', formFields);
  function StockBadge({ stock_status }) {
    let badgeVariant;

    switch (stock_status) {
      case 'Bajo':
        badgeVariant = 'outline-danger';
        break;
      case 'Indefinido':
        badgeVariant = 'outline-secondary';
        break;
      case 'Normal':
        badgeVariant = 'outline-success'; // Please note that there was a typo in 'outline-sucess'
        break;
      default:
        badgeVariant = 'outline-secondary';
    }

    return badgeVariant;
  }
  return (
    <Col lg="12" className="mb-5">
      <div className="d-flex justify-content-between">
        <h2 className="small-title">Reporte Inventario</h2>
      </div>
      {formFields.map(({ name, image, total_amount, product_id, stock_status, Sold_amount }) => (
        <div key={name} className="mb-2 card">
          <Card className="g-0 sh-14 sh-md-10 row">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col md="2" className="h-100 col-auto">
                  <img
                    src={`${process.env.REACT_APP_BASE_API_URL}/${image}`}
                    alt="image"
                    className="card-img card-img-horizontal sw-13 sw-md-12"
                    id="contactThumb"
                  />
                </Col>
                <Col md="2" className="d-flex align-items-center justify-content-center text-muted text-medium">
                  <span>{name}</span>
                </Col>
                <Col md="2" className="d-flex align-items-center justify-content-center text-muted text-medium">
                  <span>{total_amount}</span>
                </Col>
                <Col md="2" className="d-flex align-items-center justify-content-center text-muted text-medium">
                  <Badge bg={StockBadge({ stock_status })} className="me-1">
                    {stock_status}
                  </Badge>
                </Col>
                <Col md="2" className="d-flex align-items-center justify-content-center text-muted text-medium">
                  <span>{Sold_amount}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Col>
  );
};
