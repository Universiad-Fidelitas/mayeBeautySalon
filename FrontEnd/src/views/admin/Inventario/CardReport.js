import React, { useEffect, useState, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { getReport1 } from 'store/reports/reportsThunk';
import { Col, Row } from 'react-bootstrap';

import { ControlsPageSize, Table, TablePagination } from 'components/datatables';

export const CardReport = () => {
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isReportsLoading, reports, pageCount } = useSelector((state) => state.reports);
  console.log('1', reports);
  console.log('2', isReportsLoading);
  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Imagen',
        accessor: 'image',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
        hideColumn: true,
      },
      {
        Header: 'Producto',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Cantidad en producto',
        accessor: 'total_amount',
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Estado del inventario',
        accessor: 'stock_status',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Cantidad vendida',
        accessor: 'Sold_amount',
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Product_id',
        accessor: 'product_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
        hideColumn: true,
      },
    ];
  }, []);
  const tableInstance = useTable(
    {
      columns,
      data,
      setData,
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [{ id: 'name', desc: true }],
        hiddenColumns: ['product_id'],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState
  );
  const {
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance;
  useEffect(() => {
    dispatch(getReport1({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term, dispatch]);

  useEffect(() => {
    if (reports.length > 0) {
      setData(reports);
    }
  }, [isReportsLoading, reports]);

  return (
    <>
      <h2 className="medium-title text-primary font-weight-bold mt-6 mb-3">Reporte de inventario</h2>
      <Row className="mb-3">
        <Col sm="12" md="7" lg="9" xxl="10">
          <div className="d-inline-block">
            <ControlsPageSize tableInstance={tableInstance} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Table className="react-table rows" tableInstance={tableInstance} />
        </Col>
        <Col xs="12">
          <TablePagination tableInstance={tableInstance} />
        </Col>
      </Row>
    </>
  );
};
