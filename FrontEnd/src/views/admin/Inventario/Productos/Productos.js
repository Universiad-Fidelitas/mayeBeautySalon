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
import { useDispatch } from 'react-redux';
import { Col, Form, Row, FormCheck } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { useProducts } from 'hooks/react-query/useProducts';
import { ProductosModalAddEdit } from './ProductosModalAddEdit';
import { ProductosTableListItem } from './ProductosTableListItem';
import { ProductosTableListItemHeader } from './ProductosTableListItemHeader';

const Productos = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Productos';
  const description = 'Server side api implementation.';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const [term2, setTerm2] = useState(true);
  const dispatch = useDispatch();
  const [pageCount, setPageCount] = useState();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'product_id',
        accessor: 'product_id',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Imagen',
        accessor: 'image',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Detalle del producto',
        accessor: 'name',
        sortable: true,
        headerClassName: 'col-lg-2 col-12',
      },
      {
        Header: 'Proveedor',
        accessor: 'provider_name',
        sortable: true,
        headerClassName: 'col-10 col-lg-2',
      },
      {
        Header: 'Precio de compra',
        accessor: 'price_buy',
        sortable: true,
        headerClassName: 'col-lg-2 col-12',
      },
      {
        Header: 'Precio de venta',
        accessor: 'price',
        sortable: true,
        headerClassName: 'col-lg-2 col-12',
      },
      {
        Header: 'Tamaño',
        accessor: 'size',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Marca',
        accessor: 'brand_name',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Categoria',
        accessor: 'category_name',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Marca ID',
        accessor: 'brand_id',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Proveedor ID',
        accessor: 'provider_id',
        sortable: true,
        hideColumn: true,
      },
      {
        Header: 'Categoria ID',
        accessor: 'category_id',
        sortable: true,
        hideColumn: true,
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
        sortBy: [{ id: 'name', desc: false }],
        hiddenColumns: ['product_id', 'category_id', 'brand_id', 'provider_id'],
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

  const { getProducts, inactivateProductos } = useProducts({ term, pageIndex, pageSize, sortBy, term2 });
  const { isSuccess: isProductsDataSuccess, data: ProductsData } = getProducts;
  console.log(term2);
  useEffect(() => {
    if (isProductsDataSuccess) {
      setData(ProductsData.items);
      setPageCount(ProductsData.pageCount);
    }
  }, [isProductsDataSuccess, ProductsData]);

  const deleteItems = useCallback(
    async (values) => {
      inactivateProductos.mutateAsync(values);
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
                  <ControlsVisible checked={term2} onChange={() => searchItem2(!term2)} tableInstance={tableInstance} />{' '}
                  <ControlsAdd tableInstance={tableInstance} /> <ControlsEdit tableInstance={tableInstance} />{' '}
                  <ControlsDelete
                    tableInstance={tableInstance}
                    deleteItems={deleteItems}
                    modalTitle="¿Desea eliminar el producto seleccionado?"
                    modalDescription="El producto seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                    type="product"
                  />
                </div>
                <div className="d-inline-block">
                  <ControlsPageSize tableInstance={tableInstance} />
                </div>
              </Col>
            </Row>
            <Row>
              <ProductosTableListItemHeader tableInstance={tableInstance} />
              <ProductosTableListItem tableInstance={tableInstance} />
              <Col xs="12">
                <TablePagination tableInstance={tableInstance} />
              </Col>
            </Row>
          </div>
          <ProductosModalAddEdit tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy }} />
        </Col>
      </Row>
    </>
  );
};
export default Productos;
