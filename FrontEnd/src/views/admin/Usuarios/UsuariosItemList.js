import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import classNames from 'classnames';

const UsuariosItemList = ({ tableInstance }) => {
  const { page, prepareRow, toggleAllPageRowsSelected, setIsOpenAddEditModal } = tableInstance;

  const clickedForEdit = (event, row) => {
    event.preventDefault();
    toggleAllPageRowsSelected(false);
    row.toggleRowSelected();
    setIsOpenAddEditModal(true);
  };
  return (
    <>
      <div className="list mb-5">
        {page.map((row, i) => {
          prepareRow(row);
          const { email, activated, first_name, last_name, phone, role_id, image, id_card } = row.original;
          const { checked, onChange } = row.getToggleRowSelectedProps();

          return (
            <Card key={`card.${i}`} {...row.getRowProps()} className={classNames('mb-2', { selected: row.isSelected })}>
              <Row className="g-0 h-100 sh-lg-9 position-relative" onClick={(event) => clickedForEdit(event, row)}>
                <Col className="col-auto position-relative view-click">
                  <img src={`${process.env.REACT_APP_BASE_API_URL}/${image}`} alt={id_card} className="card-img card-img-horizontal sw-11 h-100 h-100 sh-lg-9 thumb" id="contactThumb" />
                </Col>
                <Col className="py-3 py-sm-3">
                  <Card.Body className="ps-5 pe-4 pt-0 pb-0 h-100">
                    <Row className="g-0 h-100 align-content-center">
                      <Col className="col-10 col-lg-3 d-flex flex-column mb-lg-0 mb-3 mb-lg-0 pe-3 d-flex order-1 view-click">
                        <div className="name">{`${first_name} ${last_name}`}</div>
                        <div className="text-small text-muted text-truncate position">{role_id}</div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate id_card">{id_card}</div>
                      </Col>
                      <Col xs="12" lg="3" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                        <div className="lh-1 text-alternate email">{email}</div>
                      </Col>
                      <Col xs="12" lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                        <div className="lh-1 text-alternate phone">{phone}</div>
                      </Col>
                      <Col xs="12" lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-5">
                        {
                          activated === 1 ? (
                            <span className="badge bg-outline-success">Activo</span>
                          ) : (
                            <span className="badge bg-outline-danger">Inactivo</span>
                          )
                        }             
                      </Col>
                      <Col xs="1" lg="1" className="d-flex flex-column mb-2 mb-lg-0 align-items-end order-2 order-lg-last">
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
export default UsuariosItemList;
