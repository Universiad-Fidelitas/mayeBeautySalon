import React, { useEffect, useState, useCallback } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch, ControlsDelete, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { usePayments } from 'hooks/react-query/usePayments';
import { PagosModalAddEdit } from './PagosModalAddEdit';
import { PagosTableListItem } from './PagosTableListItem';
import { PagosTableListItemHeader } from './PAgosTableListItemHeader';

const Pagos = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Pagos';
  const description = 'Server side api implementation.';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const [pageCount, setPageCount] = useState();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'payment_id',
        accessor: 'payment_id',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Voucher',
        accessor: 'voucher_path',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Tipo de pago',
        accessor: 'payment_type',
        sortable: true,
        headerClassName: 'col-lg-2 col-12',
      },
      {
        Header: 'Estado del pago',
        accessor: 'status',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'Nombre Cliente',
        accessor: 'first_name',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'Fecha de Cita',
        accessor: 'appointment_date',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'Fecha de Venta',
        accessor: 'inventory_date',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'No Factura',
        accessor: 'bills_id',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'Número de teléfono del SINPE',
        accessor: 'sinpe_phone_number',
        sortable: true,
        hideColumn: true,
      },

      {
        Header: '',
        id: 'action',
        headerClassName: 'empty w-10',
        Cell: ({ row }) => {
          const { checked, onChange } = row.getToggleRowSelectedProps();
          return <Form.Check className="form-check float-end mt-1" type="checkbox" checked={checked} onChange={onChange} />;
        },
      },
    ];
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      setData,
      isOpenAddEditModal,
      setIsOpenAddEditModal,
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [{ id: 'payment_id', desc: false }],
        hiddenColumns: ['payment_id', 'voucher_path', 'sinpe_phone_number'],
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

  const { getPayments, inactivatePayments } = usePayments({ term, pageIndex, pageSize, sortBy });
  const { isSuccess: isPaymentsDataSuccess, data: PaymentsData } = getPayments;

  useEffect(() => {
    if (isPaymentsDataSuccess) {
      setData(PaymentsData.items);
      setPageCount(PaymentsData.pageCount);
    }
  }, [isPaymentsDataSuccess, PaymentsData]);

  const deleteItems = useCallback(
    async (values) => {
      inactivatePayments.mutateAsync(values);
    },
    [inactivatePayments]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  return (
    <>
      <HtmlHead title={title} description={description} />

      <Row>
        <Col>
          <div className="page-title-container">
            <Row>
              <Col xs="12" md="7">
                <h1 className="mb-0 pb-0 display-4">{title}</h1>
                <BreadcrumbList items={breadcrumbs} />
              </Col>
              <Col xs="12" md="5" className="d-flex align-items-start justify-content-end">
                <ButtonsAddNew tableInstance={tableInstance} />
              </Col>
            </Row>
          </div>

          <div>
            <Row className="mb-3">
              <Col sm="12" md="5" lg="3" xxl="2">
                <div className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
                  <ControlsSearch tableInstance={tableInstance} onChange={searchItem} />
                </div>
              </Col>
              <Col sm="12" md="7" lg="9" xxl="10" className="text-end">
                <div className="d-inline-block me-0 me-sm-3 float-start float-md-none">
                  <ControlsAdd tableInstance={tableInstance} /> <ControlsEdit tableInstance={tableInstance} />{' '}
                  <ControlsDelete
                    tableInstance={tableInstance}
                    deleteItems={deleteItems}
                    modalTitle="¿Desea eliminar el pago seleccionado?"
                    modalDescription="El pago seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                    type="payment"
                    tipo="pago"
                  />
                </div>
                <div className="d-inline-block">
                  <ControlsPageSize tableInstance={tableInstance} />
                </div>
              </Col>
            </Row>
            <Row>
              <PagosTableListItemHeader tableInstance={tableInstance} />
              <PagosTableListItem tableInstance={tableInstance} />
              <Col xs="12">
                <TablePagination tableInstance={tableInstance} />
              </Col>
            </Row>
          </div>
          <PagosModalAddEdit tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy }} />
        </Col>
      </Row>
    </>
  );
};
export default Pagos;
