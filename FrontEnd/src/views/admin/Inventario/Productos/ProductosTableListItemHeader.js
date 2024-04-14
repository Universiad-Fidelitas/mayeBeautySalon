import React from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';

export const ProductosTableListItemHeader = ({ tableInstance }) => {
  const { headerGroups } = tableInstance;

  return (
    <>
      <div className="mb-4 mb-lg-3 bg-transparent no-shadow d-none d-lg-block">
        <Row className=" g-0">
          <Col xs="auto" className="sw-9 sw-lg-15 d-none d-lg-flex" />
          <Col>
            <div className="ps-0 ps-5 pe-4 pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center custom-sort">
                {headerGroups.map((headerGroup, headerIndex) =>
                  headerGroup.headers.map((column) => {
                    if (column.hideColumn) {
                      return null;
                    }
                    return (
                      <div key={`header.${headerIndex}`} className={column.headerClassName} {...column.getHeaderProps(column.getSortByToggleProps())}>
                        <div
                          className={classNames('text-muted text-medium cursor-pointer text-uppercase ', {
                            sort: column.sortable,
                            desc: column.isSortedDesc,
                            asc: column.isSorted && !column.isSortedDesc,
                          })}
                        >
                          {column.render('Header')}
                        </div>
                      </div>
                    );
                  })
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
