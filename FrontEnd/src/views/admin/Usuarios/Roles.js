import React, { useEffect, useState, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { deleteRols, editRol, getRols, postRol } from 'store/roles';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { DB_TABLE_ROLS } from 'data/rolsData';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ModalEditPermissions } from './ModalEditPermissions';

const Roles = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Roles de usuario';
  const description = 'Server side api implementation.';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const [term2, setTerm2] = useState(true);
  const dispatch = useDispatch();
  const { isRolesLoading, rols, pageCount } = useSelector((state) => state.rols);
  const { userHasPermission } = useUserPermissions();

  const returnColorName = (permissionType) => {
    if (permissionType === 'C') {
      return 'success';
    }
    if (permissionType === 'R') {
      return 'info';
    }
    if (permissionType === 'U') {
      return 'warning';
    }
    return 'danger';
  };

  const returnPermissionTypeName = (permissionType) => {
    if (permissionType === 'C') {
      return 'Crear';
    }
    if (permissionType === 'R') {
      return 'Obtener';
    }
    if (permissionType === 'U') {
      return 'Actualizar';
    }
    return 'Eliminar';
  };

  const PermissionRowList = ({ permissionsList }) => {
    return DB_TABLE_ROLS.map(({ permissionName, permissionKey }, index) => (
      <div className={`${index !== DB_TABLE_ROLS.length - 1 ? 'mb-3' : 'mb-1'}`} key={index}>
        <Col className="d-flex flex-row justify-content-between align-items-center">
          <p className="h6 text-primary m-0">{permissionName}</p>
        </Col>
        {['C', 'R', 'U', 'D'].map((permissionType, indexItem) => {
          return (
            permissionsList.includes(`${permissionType}_${permissionKey}`) && (
              <span key={indexItem} className={`me-1 badge bg-outline-${returnColorName(permissionType)}`}>{`${returnPermissionTypeName(
                permissionType
              )} ${permissionName.toLocaleLowerCase()}`}</span>
            )
          );
        })}
      </div>
    ));
  };

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'role_id',
        accessor: 'role_id',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
        hideColumn: true,
      },
      {
        Header: 'Nombre del rol',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Estado del rol',
        accessor: 'activated',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Permisos',
        accessor: 'permissions',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
        Cell: ({ row }) => <PermissionRowList permissionsList={JSON.parse(row.values.permissions)} />,
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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'role_id', desc: false }], hiddenColumns: ['role_id'] },
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
    dispatch(getRols({ term, sortBy, pageIndex, pageSize, term2 }));
  }, [sortBy, pageIndex, pageSize, term, dispatch, term2]);
  useEffect(() => {
    if (rols.length > 0) {
      setData(rols);
    } else {
      setData([]);
    }
  }, [isRolesLoading, rols]);

  const deleteItems = useCallback(
    async (values) => {
      dispatch(deleteRols(values));
    },
    [dispatch]
  );

  const editItem = useCallback(
    async (values) => {
      dispatch(editRol(values));
    },
    [dispatch]
  );

  const addItem = useCallback(
    async (values) => {
      dispatch(postRol(values));
    },
    [dispatch]
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
              {userHasPermission('C_ROLES') && (
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
                  <ControlsVisible tableInstance={tableInstance} checked={term2} onChange={() => searchItem2(!term2)} />
                  {userHasPermission('C_ROLES') && <ControlsAdd tableInstance={tableInstance} />}
                  {userHasPermission('U_ROLES') && <ControlsEdit tableInstance={tableInstance} />}
                  {userHasPermission('D_ROLES') && (
                    <ControlsDelete
                      tableInstance={tableInstance}
                      deleteItems={deleteItems}
                      modalTitle="¿Desea eliminar el rol seleccionado?"
                      modalDescription="El rol seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                      type="role"
                      tipo="rol"
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
          <ModalEditPermissions tableInstance={tableInstance} addItem={addItem} editItem={editItem} />
        </Col>
      </Row>
    </>
  );
};

export default Roles;
