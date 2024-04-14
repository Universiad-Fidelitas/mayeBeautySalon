import React, { useEffect, useState, useCallback } from 'react';
import {
  ModalAddEdit,
  ButtonsAddNew,
  ContservicesPageSize,
  ContservicesAdd,
  ContservicesEdit,
  ContservicesSearch,
  ContservicesDelete,
  Table,
  TablePagination,
} from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteServices, editService, getServices, postService } from 'store/services';
import { Col, Form, Row } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';

const Servicio = () => {
  const title = 'Servicio';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'citas/calendario', text: 'Citas' },
    { to: 'citas/servicios', title: 'Servicios' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isServiceesLoading, services, pageCount } = useSelector((state) => state.services);

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Servicio Id',
        accessor: 'service_id',
      },
      {
        Header: 'Servicio',
        accessor: 'name',
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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'name', desc: false }], hiddenColumns: ['service_id'] },
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
    dispatch(getServices({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term]);

  useEffect(() => {
    if (services.length > 0) {
      setData(services);
    }
  }, [isServiceesLoading]);

  const deleteItems = useCallback(
    async (values) => {
      console.log('delete service', values);
      dispatch(deleteServices(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const editItem = useCallback(
    async (values) => {
      dispatch(editService(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const addItem = useCallback(
    async (values) => {
      dispatch(postService(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('El nombre es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(15, 'El nombre debe tener al máximo |5 caracteres'),
    price: Yup.number()
      .required(<span style={{ color: 'red' }}>El precio del gasto es requerido</span>)
      .typeError(<span style={{ color: 'red' }}>El precio solo acepta números</span>)
      .min(1, <span style={{ color: 'red' }}>'El precio debe ser mayor a 1'</span>),
  });

  const formFields = [
    {
      id: 'name',
      label: 'Nombre del servicio',
    },
    {
      id: 'duration',
      label: 'Duracion',
    },
    {
      id: 'price',
      label: 'Precio',
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
                  <ContservicesSearch tableInstance={tableInstance} onChange={searchItem} />
                </div>
              </Col>
              <Col sm="12" md="7" lg="9" xxl="10" className="text-end">
                <div className="d-inline-block me-0 me-sm-3 float-start float-md-none">
                  <ContservicesAdd tableInstance={tableInstance} /> <ContservicesEdit tableInstance={tableInstance} />{' '}
                  <ContservicesDelete
                    tableInstance={tableInstance}
                    deleteItems={deleteItems}
                    type="service"
                    modalTitle="¿Desea eliminar el servicio seleccionado?"
                    modalDescription="El servicio seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                  />
                </div>
                <div className="d-inline-block">
                  <ContservicesPageSize tableInstance={tableInstance} />
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
          <ModalAddEdit tableInstance={tableInstance} addItem={addItem} editItem={editItem} validationSchema={validationSchema} formFields={formFields} />
        </Col>
      </Row>
    </>
  );
};
export default Servicio;
