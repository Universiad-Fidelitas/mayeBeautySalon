import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import classNames from 'classnames';

export const ProductosTableListItem = ({ tableInstance }) => {
  const { page, prepareRow } = tableInstance;

  return (
    <>
      <div className="list mb-5">
        {page.map((row, i) => {
          prepareRow(row);
          const { price_buy, size, name, provider_name, image, id_card, category_name, brand_name, price, activated } = row.original;
          const { checked, onChange } = row.getToggleRowSelectedProps();

          return (
            <Card key={`card.${i}`} {...row.getRowProps()} className={classNames('mb-2', { selected: row.isSelected })}>
              <Row className="g-0 h-100 position-relative" onClick={onChange}>
                <Col className="col-auto position-relative view-click">
                  <img
                    src={`${process.env.REACT_APP_BASE_API_URL}/${image}`}
                    alt={id_card}
                    className="card-img card-img-horizontal sw-9 sw-lg-15 h-100 thumb"
                    id="contactThumb"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg';
                    }}
                  />
                </Col>
                <Col className="py-3 py-sm-3">
                  <Card.Body className="h-100 ps-3 ps-lg-5 pe-4 pt-0 pb-0 d-flex flex-column justify-content-center">
                    <Row className="w-100">
                      <Col xs="12" lg="2" className="d-flex flex-column d-flex order-1 view-click">
                        <h5 className="text-primary font-weight-bold">{name}</h5>
                        <p className="m-0">
                          <span className="text-primary">Tamaño:</span> {size}
                        </p>
                        <p className="m-0">
                          <span className="text-primary">Marca:</span> {brand_name}
                        </p>
                        <p className="m-0">
                          <span className="text-primary">Categoria:</span> {category_name}
                        </p>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">{provider_name}</div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">
                          {parseFloat(price_buy).toLocaleString('es-CR', {
                            style: 'currency',
                            currency: 'CRC',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </Col>
                      <Col xs="8" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <h5 className="text-primary font-weight-bold">
                          {parseFloat(price).toLocaleString('es-CR', {
                            style: 'currency',
                            currency: 'CRC',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </h5>
                      </Col>
                      <Col xs="8" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">
                          {' '}
                          {activated ? <span className="badge bg-outline-success">Activo</span> : <span className="badge bg-outline-danger">Inactivo</span>}
                        </div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column mb-2 mb-lg-0 align-items-end order-2 order-lg-last justify-content-center">
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
