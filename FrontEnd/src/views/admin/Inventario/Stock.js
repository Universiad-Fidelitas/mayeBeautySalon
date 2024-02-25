/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsSearch, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { getStock } from 'store/stock/stockThunk';
import { Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useCategories } from 'hooks/react-query/useCategories';

const Stock = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Stock';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/inventariado', text: f({ id: 'Inventariado' }) },
    { to: '/inventariado/stock', title: 'Stock' },
  ];
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isLoading, data: categoriesData } = useCategories();
  const [category, setCategory] = useState('');
  const { isStockLoading, stock, pageCount } = useSelector((state) => state.stock);
  const categoryDataDropdown = useMemo(
    () =>
      categoriesData?.items.map(({ category_id, name }) => {
        return { value: category_id, label: name };
      }),
    [categoriesData]
  );

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Imagen',
        accessor: 'image',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase col-10 col-lg-1',
        hideColumn: true,
      },
      {
        Header: 'Nombre',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Precio',
        accessor: 'price',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Tamaño',
        accessor: 'size',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Cantidad',
        accessor: 'total_amount',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
    ];
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      setData,
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
  useEffect(() => {
    dispatch(getStock({ term, sortBy, pageIndex, pageSize, category }));
  }, [sortBy, pageIndex, pageSize, term, category]);

  useEffect(() => {
    if (stock.length > 0) {
      setData(stock);
    }
  }, [isStockLoading]);

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
            </Row>
            {categoryDataDropdown && (
              <>
                <div className="mb-3">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option value="">Elija una categoria</option>
                    {categoryDataDropdown.map(({ value, label }, length) => (
                      <option key={length} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <Row className="mb-3">
              <Col sm="12" md="5" lg="3" xxl="2">
                <div className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
                  <ControlsSearch tableInstance={tableInstance} onChange={searchItem} />
                </div>
              </Col>
              <Col sm="12" md="7" lg="9" xxl="10" className="text-end">
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
        </Col>
      </Row>
    </>
  );
};
export default Stock;
