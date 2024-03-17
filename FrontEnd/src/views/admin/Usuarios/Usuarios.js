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
import { deleteUsers, editUser, getUsers, postUser } from 'store/users';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ModalAddEditUsuarios } from './ModalAddEditUsuarios';
import UsuariosItemList from './UsuariosItemList';
import UsuariosItemListHeader from './UsuariosItemListHeader';
import UsuariosItemListPagination from './UsuariosItemListPagination';

const Usuarios = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Usuarios';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'trabajadores/users', text: f({ id: 'menu.trabajadores' }) },
    { to: 'trabajadores/roles', title: 'Usuarios' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isUsersLoading, users, pageCount } = useSelector((state) => state.users);
  const { userHasPermission } = useUserPermissions();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'user_id',
        accessor: 'user_id',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: 'Nombre',
        accessor: 'first_name',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-3',
      },
      {
        Header: 'Apellidos',
        accessor: 'last_name',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: 'Cédula',
        accessor: 'id_card',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-2',
      },
      {
        Header: 'Correo electrónico',
        accessor: 'email',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-3',
      },
      {
        Header: 'Teléfono',
        accessor: 'phone',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-2',
      },
      {
        Header: 'Estado',
        accessor: 'activated',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
      },
      {
        Header: 'Imagen',
        accessor: 'image',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: 'role_id',
        accessor: 'role_id',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: 'Salario',
        accessor: 'salary',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
        hideColumn: true,
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

  useEffect(() => {
    dispatch(getUsers({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term]);

  useEffect(() => {
    if (users.length > 0) {
      setData(users);
    }
  }, [isUsersLoading]);

  const deleteItems = useCallback(
    async (values) => {
      dispatch(deleteUsers(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const editItem = useCallback(
    async (values) => {
      dispatch(editUser(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const addItem = useCallback(
    async (values) => {
      dispatch(postUser(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required(<span style={{ color: 'red' }}>El nombre es requerido</span>)
      .min(3, <span style={{ color: 'red' }}>El nombre debe tener al menos 3 caracteres</span>)
      .max(15, <span style={{ color: 'red' }}>El nombre no puede tener más de 15 caracteres</span>),
    last_name: Yup.string()
      .required(<span style={{ color: 'red' }}>El apellido es requerido</span>)
      .min(3, <span style={{ color: 'red' }}>El apellido debe tener al menos 3 caracteres</span>)
      .max(15, <span style={{ color: 'red' }}>El apellido no puede tener más de 15 caracteres</span>),
    id_card: Yup.string()
      .matches(/^\d+$/, <span style={{ color: 'red' }}>La cédula debe ser un número</span>)
      .min(9, <span style={{ color: 'red' }}>La cédula debe tener al menos 9 números</span>)
      .max(15, <span style={{ color: 'red' }}>La cédula no puede tener más de 15 números</span>)
      .required(<span style={{ color: 'red' }}>La cédula es requerida</span>),
    email: Yup.string()
      .email(<span style={{ color: 'red' }}>Email inválido</span>)
      .required(<span style={{ color: 'red' }}>Email es requerido</span>),
    phone: Yup.string()
      .matches(/^\d+$/, "El teléfono debe ser un número")
      .min(8, <span style={{ color: 'red' }}>El teléfono debe tener al menos 8 números</span>)
      .max(10, <span style={{ color: 'red' }}>El teléfono no puede tener más de 10 números</span>)
      .required(<span style={{ color: 'red' }}>El teléfono es requerido</span>),
  });

  const formFields = [
    {
      id: 'first_name',
      label: 'Nombre',
      type: 'text',
    },
    {
      id: 'last_name',
      label: 'Apellidos',
      type: 'text',
    },
    {
      id: 'id_card',
      label: 'Cédula',
      type: 'text',
    },
    {
      id: 'email',
      label: 'Correo Electrónico',
      type: 'text',
    },
    {
      id: 'phone',
      label: 'Teléfono',
      type: 'text',
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
          <ModalAddEditUsuarios
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

export default Usuarios;
