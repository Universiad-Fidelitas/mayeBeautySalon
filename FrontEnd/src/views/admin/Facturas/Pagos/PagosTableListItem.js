import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import classNames from 'classnames';

export const PagosTableListItem = ({ tableInstance }) => {
  const { page, prepareRow } = tableInstance;
  const formatDate = (value) => {
    if (value === null) {
      return '';
    }
    const dateObject = new Date(value);
    const dateString = dateObject.toLocaleDateString();
    const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} ${timeString}`;
  };
  return (
    <>
      <div className="list mb-5">
        {page.map((row, i) => {
          prepareRow(row);
          const { status, payment_type, sinpe_phone_number, voucher_path, payment_id, first_name, last_name, inventory_date, appointment_date, bills_id } =
            row.original;
          const { checked, onChange } = row.getToggleRowSelectedProps();

          return (
            <Card key={`card.${i}`} {...row.getRowProps()} className={classNames('mb-2', { selected: row.isSelected })}>
              <Row className="g-0 h-100 position-relative" onClick={onChange}>
                <Col className="col-auto position-relative view-click">
                  <img
                    src={`${process.env.REACT_APP_BASE_API_URL}/${voucher_path}`}
                    alt={payment_id}
                    className="card-img card-img-horizontal sw-9 sw-lg-15 h-100 thumb"
                    id="contactThumb"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://static.vecteezy.com/system/resources/thumbnails/002/745/930/small/sales-printed-receipt-icon-free-vector.jpg';
                    }}
                  />
                </Col>
                <Col className="py-3 py-sm-3">
                  <Card.Body className="h-100 ps-3 ps-lg-5 pe-4 pt-0 pb-0 d-flex flex-column justify-content-center">
                    <Row className="w-100">
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-1">
                        <div className="lh-1 text-alternate id_card">
                          <p className="m-0">
                            <span className="text-primary">No de factura: </span> {bills_id}
                          </p>
                        </div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column d-flex order-3 view-click">
                        <h5 className="text-primary font-weight-bold">{payment_type}</h5>

                        {payment_type === 'sinpe' && (
                          <>
                            <p className="m-0">
                              <span className="text-primary">Número SINPE:</span> {sinpe_phone_number}
                            </p>
                          </>
                        )}
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">{status}</div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">
                          <p className="m-0">
                            <span className="text-primary">Nombre del cliente: </span> {first_name} {last_name}
                          </p>
                        </div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">
                          <p className="m-0">
                            <span className="text-primary">Fecha de Cita: </span> {formatDate(appointment_date)}
                          </p>
                        </div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">
                          <p className="m-0">
                            <span className="text-primary">Fecha de venta: </span> {formatDate(inventory_date)}
                          </p>
                        </div>
                      </Col>

                      <Col className="d-flex flex-column align-items-end order-3  justify-content-center">
                        <Form.Check className="form-check mt-2" type="checkbox" checked={checked} onChange={onChange} />
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          );
        })}
      </div>
    </>
  );
};
