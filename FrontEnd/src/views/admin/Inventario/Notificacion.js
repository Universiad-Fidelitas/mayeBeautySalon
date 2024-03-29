import React, { useEffect, useState, useCallback } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch, ControlsDelete, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, postNotification, editNotification, deleteNotifications } from 'store/notifications/notificationsThunk';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { ModalAddEditNotificacion } from './ModalAddEditNotificacion';

const Marcas = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Notificaciones';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/inventariado', text: f({ id: 'Inventariado' }) },
    { to: '/inventariado/notifications', title: 'Notificaciones' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isNotificationsLoading, notifications, pageCount } = useSelector((state) => state.notifications);

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'ID',
        accessor: 'notification_id',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Producto',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Producto ID',
        accessor: 'product_id',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Cantidad',
        accessor: 'amount',
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
      pageCount,
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'name', desc: true }], hiddenColumns: ['notification_id', 'product_id'] },
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
    dispatch(getNotifications({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term]);

  useEffect(() => {
    if (notifications.length > 0) {
      setData(notifications);
    }
  }, [isNotificationsLoading]);

  const deleteItems = useCallback(
    async (values) => {
      dispatch(deleteNotifications(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const editItem = useCallback(
    async (values) => {
      dispatch(editNotification(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const addItem = useCallback(
    async (values) => {
      dispatch(postNotification(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required(<span style={{ color: 'red' }}>La cantidad es requerida</span>)
      .min(1, <span style={{ color: 'red' }}>La cantidad debe ser mayor a 1</span>),
  });

  const formFields = [
    {
      id: 'amount',
      label: 'Cantidad',
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
                    modalTitle="¿Desea eliminar la notificación seleccionada?"
                    modalDescription="La notificacion seleccionada se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                    type="notification"
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
          <ModalAddEditNotificacion
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
export default Marcas;
