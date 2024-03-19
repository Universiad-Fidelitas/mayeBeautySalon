import React, { useEffect, useState, useCallback } from 'react';
import {
  ModalAddEdit,
  ButtonsAddNew,
  ControlsPageSize,
  ControlsAdd,
  ControlsEdit,
  ControlsSearch,
  ControlsDelete,
  Table,
  TablePagination,
} from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, postPayment, editPayment, deletePayments } from 'store/payments/paymentsThunk';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { ModalAddEditPagos } from './ModalAddEditPago';

const Pagos = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Pagos';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/inventariado', text: f({ id: 'inventory.title' }) },
    { to: '/inventariado/payments', title: 'Pagos' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();


  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Imagen',
        accessor: 'image',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: 'Tipo',
        accessor: 'payment_type',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Telefono',
        accessor: 'sinpe_phone',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Estado',
        accessor: 'status',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Tamaño',
        accessor: 'size',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Voucher',
        accessor: 'voucher_path',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
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
   
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [{ id: 'name', desc: false }],
        hiddenColumns: ['payment_id'],
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
    dispatch(getPayments({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term]);

 

  const deleteItems = useCallback(
    async (values) => {
      dispatch(deletePayments(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const editItem = useCallback(
    async (values) => {
      dispatch(editPayment(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const addItem = useCallback(
    async (values) => {
      dispatch(postPayment(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(<span style={{ color: 'red' }}>El nombre es requerido</span>)
      .min(3, <span style={{ color: 'red' }}>El nombre debe tener al menos 3 caracteres</span>)
      .max(15, <span style={{ color: 'red' }}>El nombre no puede tener más de 15 caracteres</span>),
    price: Yup.number()
      .required(<span style={{ color: 'red' }}>El precio es requerido</span>)
      .typeError(<span style={{ color: 'red' }}>El precio solo acepta números</span>)
      .min(3, <span style={{ color: 'red' }}>El precio debe ser mayor a 1</span>),
    price_buy: Yup.number()
      .required(<span style={{ color: 'red' }}>El precio es requerido</span>)
      .typeError(<span style={{ color: 'red' }}>El precio solo acepta números</span>)
      .min(3, <span style={{ color: 'red' }}>El precio debe ser mayor a 1</span>),
    size: Yup.string()
      .matches(/^\d+$/, "El tamaño debe ser un número")
      .min(1, <span style={{ color: 'red' }}>El tamaño debe tener al menos 1 números</span>)
      .max(6, <span style={{ color: 'red' }}>El tamaño no puede tener más de 6 números</span>)
      .required(<span style={{ color: 'red' }}>El tamaño es requerido</span>),
  });

  const formFields = [
    {
      id: 'name',
      label: 'Tipo',
      type: 'text',
    },
    {
      id: 'price',
      label: 'Telefono',
      type: 'text',
    },
    {
      id: 'price_buy',
      label: 'Estado',
      type: 'number',
    },
  ];

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
                    modalTitle="¿Desea eliminar el Paymento seleccionado?"
                    modalDescription="El Paymento seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                    type="Payment"
                  />
                </div>
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
          </div>
          <ModalAddEditPagos
            tableInstance={tableInstance}
            addItem={addItem}
            editItem={editItem}
            validationSchema={validationSchema}
            formFields={formFields}
          />
        </Col>
      </Row>
    </>
  );
};
export default Pagos;
