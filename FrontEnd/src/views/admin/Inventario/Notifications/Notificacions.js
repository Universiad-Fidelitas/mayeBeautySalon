import React, { useEffect, useState, useCallback } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch, ControlsDelete, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch } from 'react-redux';
import { deleteNotifications } from 'store/notifications/notificationsThunk';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useNotifications } from 'hooks/react-query/useNotificacions';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { NotificacionsModalAddEdit } from './NotificacionsModalAddEdit';

export const Notificacions = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Notificaciones';
  const description = 'En este módulo se va a crear las alertas para que el sistema le notifique cuando un producto esta bajo de inventario';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const [pageCount, setPageCount] = useState();
  const { userHasPermission } = useUserPermissions();
  const columns = React.useMemo(() => {
    return [
      {
        Header: 'notification_id',
        accessor: 'notification_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: 'Producto',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Estado',
        accessor: 'activated',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-lg-3',
      },
      {
        Header: 'Producto ID',
        accessor: 'product_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Cantidad mínima de producto',
        accessor: 'amount',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
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

  const { getNotifications, inactivateNotifications } = useNotifications({ term, pageIndex, pageSize, sortBy });
  const { isSuccess: isNotificationsDataSuccess, data: NotificationsData } = getNotifications;

  useEffect(() => {
    if (isNotificationsDataSuccess) {
      setData(NotificationsData.items);
      setPageCount(NotificationsData.pageCount);
    }
  }, [isNotificationsDataSuccess, NotificationsData]);

  const deleteItems = useCallback(
    async (values) => {
      inactivateNotifications.mutateAsync(values);
    },
    [inactivateNotifications]
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
                <br />
                <span
                  className="mb-0 pb-0 display-7
                "
                >
                  {description}{' '}
                </span>
                <br />
                <br />
                <BreadcrumbList items={breadcrumbs} />
              </Col>
              {userHasPermission('C_NOTIFICATIONS') && (
                <Col xs="12" md="5" className="d-flex align-items-start justify-content-end">
                  <ButtonsAddNew tableInstance={tableInstance} />
                </Col>
              )}
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
                  {userHasPermission('C_NOTIFICATIONS') && <ControlsAdd tableInstance={tableInstance} />}
                  {userHasPermission('U_NOTIFICATIONS') && <ControlsEdit tableInstance={tableInstance} />}{' '}
                  {userHasPermission('D_NOTIFICATIONS') && (
                    <ControlsDelete
                      tableInstance={tableInstance}
                      deleteItems={deleteItems}
                      modalTitle="¿Desea eliminar la notificación seleccionada?"
                      modalDescription="La notificacion seleccionada se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                      type="notification"
                      tipo="notificación"
                    />
                  )}
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
          <NotificacionsModalAddEdit tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy }} />
        </Col>
      </Row>
    </>
  );
};
