import React, { useEffect, useState, useCallback } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory, postInventory } from 'store/inventory/inventoryThunk';
import { Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsSearch, Table, TablePagination } from 'components/datatables';
import { ModalAddEditInventario } from './ModalAddEditInventario';

const Inventory = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Movimiento de Inventario';
  const description = 'Server side api implementation.';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isInventoryLoading, inventory, pageCount } = useSelector((state) => state.inventory);

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Inventory_Id',
        accessor: 'inventory_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
        hideColumn: true,
      },
      {
        Header: 'Producto',
        accessor: 'product_name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Fecha',
        accessor: 'date',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Tipo de Movimiento',
        accessor: 'action',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Descripción',
        accessor: 'description',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Precio',
        accessor: 'inventory_price',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Precio Producto',
        accessor: 'product_price',
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },

      {
        Header: 'Inventory_products_id',
        accessor: 'inventory_products_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
        hideColumn: true,
      },
      {
        Header: 'Cantidad',
        accessor: 'amount',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Tamaño',
        accessor: 'size',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Product_id',
        accessor: 'product_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
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
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [{ id: 'date', desc: true }],
        hiddenColumns: ['inventory_products_id', 'inventory_id', 'product_id', 'product_price'],
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
    dispatch(getInventory({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term, dispatch]);

  useEffect(() => {
    if (inventory.length > 0) {
      setData(inventory);
    }
  }, [isInventoryLoading, inventory]);

  const addItem = useCallback(
    async (values) => {
      dispatch(postInventory(values));
    },
    [dispatch]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    action: Yup.string().required('La acción es requerida'),
    description: Yup.string()
      .required('La descripción es requerida')
      .min(3, 'La descripción debe tener al menos 3 caracteres')
      .max(100, 'La descripción no puede tener más de 100 caracteres'),
    dataToInsert: Yup.array()
      .of(
        Yup.object().shape({
          product_id: Yup.string().required('El producto es requerido'),
          amount: Yup.number().min(0, 'La cantidad debe ser mayor a 0').typeError('La cantidad solo acepta números').required('La cantidad es requerida'),
        })
      )
      .required('Must have product')
      .min(1, 'Minimum of 1 product'),
  });

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
                  <ControlsAdd tableInstance={tableInstance} />
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
          <ModalAddEditInventario tableInstance={tableInstance} addItem={addItem} validationSchema={validationSchema} />
        </Col>
      </Row>
    </>
  );
};
export default Inventory;
