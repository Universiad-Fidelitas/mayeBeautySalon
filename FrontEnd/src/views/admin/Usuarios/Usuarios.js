import React, { useEffect, useState, useCallback } from 'react';
import { ModalAddEdit, ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch, ControlsDelete, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRols, editRol, getRols, postRol } from 'store/roles';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { useUserPermissions } from 'hooks/useUserPermissions';

const Usuarios = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Usuarios';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'trabajadores/usuarios', text: f({ id: 'menu.trabajadores' })},
    { to: 'trabajadores/roles', title: 'Usuarios' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isRolesLoading, rols, pageCount } = useSelector((state) => state.rols)
  const { userHasPermission } = useUserPermissions();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Rol Id',
        accessor: 'rol_id',
      },
      {
        Header: 'Name',
        accessor: 'name',
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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'name', desc: false }], hiddenColumns: ['rol_id'] },
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
    dispatch(getRols({ term, sortBy, pageIndex, pageSize }))
  }, [sortBy, pageIndex, pageSize, term])

  useEffect(() => {
    if (rols.length > 0){
      setData(rols);
    }
  }, [isRolesLoading])
  
  const deleteItems = useCallback(async (values) => {
    dispatch(deleteRols(values))
  }, [sortBy, pageIndex, pageSize]);


  const editItem = useCallback(async (values) => {
    dispatch(editRol(values))
  }, [sortBy, pageIndex, pageSize]);
  
  const addItem = useCallback(async (values) => {
    dispatch(postRol(values))
  }, [sortBy, pageIndex, pageSize]);

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .required('First Name is required')
    .min(3, 'First Name must be at least 3 character')
    .max(15, 'First Name must be at most 15 characters'),
  });

  const formFields = [
    {
      id:'name',
      label: 'Nombre del rol',
    }
  ]
  
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
              {
                userHasPermission('C_USERS') &&
                <Col xs="12" md="5" className="d-flex align-items-start justify-content-end">
                  <ButtonsAddNew tableInstance={tableInstance} />
                </Col>
              }

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
                  {
                    userHasPermission('C_USERS') && <ControlsAdd tableInstance={tableInstance} />
                  }
                  {
                    userHasPermission('U_USERS') && <ControlsEdit tableInstance={tableInstance} />
                  }
                  {
                    userHasPermission('D_USERS') && <ControlsDelete tableInstance={tableInstance} deleteItems={deleteItems} />
                  }
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
          <ModalAddEdit tableInstance={tableInstance} addItem={addItem} editItem={editItem} validationSchema={validationSchema} formFields={formFields}/>
        </Col>
      </Row>
    </>
  );
};

export default Usuarios;