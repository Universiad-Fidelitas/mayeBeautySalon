import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import HtmlHead from 'components/html-head/HtmlHead';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import {
  ButtonsAddNew,
  ControlsPageSize,
  ControlsAdd,
  ControlsEdit,
  ControlsSearch,
  ControlsDelete,
  Table,
  TablePagination,
  ControlsVisible,
} from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useServices } from 'hooks/react-query/useServices';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ModalAddEditServices } from './ModalAddEditServices';

export const ServicesView = () => {
  const { formatMessage: f } = useIntl();
  const title = f({ id: 'services.title' });
  const description = f({ id: 'services.description' });
  const breadcrumbs = [];
  const { userHasPermission } = useUserPermissions();
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');

  const [term2, setTerm2] = useState(true);
  const [pageCount, setPageCount] = useState();

  const columns = useMemo(() => {
    return [
      {
        accessor: 'service_id',
        hideColumn: true,
      },
      {
        Header: f({ id: 'services.serviceName' }),
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-lg-4',
      },
      {
        Header: f({ id: 'services.serviceTime' }),
        accessor: 'duration',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-lg-2',
      },
      {
        Header: f({ id: 'services.servicePrice' }),
        accessor: 'price',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-lg-2',
      },
      {
        Header: f({ id: 'services.serviceState' }),
        accessor: 'activated',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-lg-3',
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
  }, [f]);

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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'service_id', desc: true }], hiddenColumns: ['service_id'] },
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

  const { getServices, deleteServices } = useServices({ term, pageIndex, pageSize, sortBy, term2 });
  const { isSuccess: isServicesDataSuccess, data: servicesData } = getServices;

  useEffect(() => {
    if (isServicesDataSuccess) {
      setData(servicesData.items);
      setPageCount(servicesData.pageCount);
    }
  }, [isServicesDataSuccess, servicesData]);

  const deleteItems = useCallback(
    async (values) => {
      deleteServices.mutateAsync(values);
    },
    [deleteServices]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);
  const searchItem2 = useAsyncDebounce((val) => {
    setTerm2(val);
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
              {userHasPermission('C_SERVICES') && (
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
                  <ControlsVisible checked={term2} tableInstance={tableInstance} onChange={() => searchItem2(!term2)} />
                  {userHasPermission('C_SERVICES') && <ControlsAdd tableInstance={tableInstance} />}{' '}
                  {userHasPermission('U_SERVICES') && <ControlsEdit tableInstance={tableInstance} />}{' '}
                  {userHasPermission('D_SERVICES') && (
                    <ControlsDelete
                      tableInstance={tableInstance}
                      deleteItems={deleteItems}
                      modalTitle="¿Desea eliminar el servicio seleccionado?"
                      modalDescription="El servicio seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                      type="service"
                      tipo="servicio"
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
          {isOpenAddEditModal && <ModalAddEditServices tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy, term2 }} />}
        </Col>
      </Row>
    </>
  );
};
