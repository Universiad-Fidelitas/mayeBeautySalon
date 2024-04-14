import React, { useEffect, useState } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { Col, Row } from 'react-bootstrap';
import { useUsers } from 'hooks/react-query/useUsers';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ModalAddEditUsuarios } from './ModalAddEditUsuarios';
import UsuariosItemList from './UsuariosItemList';
import UsuariosItemListHeader from './UsuariosItemListHeader';
import UsuariosItemListPagination from './UsuariosItemListPagination';

const Usuarios = () => {
  const { formatMessage: f } = useIntl();
  const title = f({ id: 'users.userTitle' });
  const description = f({ id: 'users.userDescription' });
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const [pageCount, setPageCount] = useState();
  const { userHasPermission } = useUserPermissions();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'user_id',
        accessor: 'user_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: f({ id: 'users.first_name' }),
        accessor: 'first_name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
      },
      {
        Header: f({ id: 'users.last_name' }),
        accessor: 'last_name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: f({ id: 'users.id_card' }),
        accessor: 'id_card',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-2',
      },
      {
        Header: f({ id: 'users.id_card_type' }),
        accessor: 'id_card_type',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: f({ id: 'users.email' }),
        accessor: 'email',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
      },
      {
        Header: f({ id: 'users.phone' }),
        accessor: 'phone',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-2',
      },
      {
        Header: f({ id: 'users.state' }),
        accessor: 'activated',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-1',
      },
      {
        accessor: 'image',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        accessor: 'role_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: 'Salario',
        accessor: 'salary',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-1',
        hideColumn: true,
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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'first_name', desc: false }], hiddenColumns: ['user_id'] },
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

  const { getUsers } = useUsers({ term, pageIndex, pageSize, sortBy });
  const { isSuccess: isUsersDataSuccess, data: usersData } = getUsers;

  useEffect(() => {
    if (isUsersDataSuccess) {
      setData(usersData.items);
      setPageCount(usersData.pageCount);
    }
  }, [isUsersDataSuccess, usersData]);

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
              {userHasPermission('C_USERS') && (
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
                  {userHasPermission('C_USERS') && <ControlsAdd tableInstance={tableInstance} />}
                  {userHasPermission('U_USERS') && <ControlsEdit tableInstance={tableInstance} />}
                </div>
                <div className="d-inline-block">
                  <ControlsPageSize tableInstance={tableInstance} />
                </div>
              </Col>
            </Row>
          </div>
          <UsuariosItemListHeader tableInstance={tableInstance} />
          <UsuariosItemList tableInstance={tableInstance} />
          <UsuariosItemListPagination tableInstance={tableInstance} />
          <ModalAddEditUsuarios tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy }} />
        </Col>
      </Row>
    </>
  );
};

export default Usuarios;
