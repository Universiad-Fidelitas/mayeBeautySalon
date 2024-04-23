import React, { useEffect, useState, useCallback } from 'react';
import { ButtonsAddNew, ControlsPageSize, ControlsAdd, ControlsEdit, ControlsSearch, ControlsDelete, Table, TablePagination } from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch } from 'react-redux';
// import { deleteBrands } from 'store/brands/brandsThunk';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useBrands } from 'hooks/react-query/useBrands';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { MarcasModalAddEdit } from './MarcasModalAddEdit';

const Marcas = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Marcas';
  const description = 'Server side api implementation.';
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
        Header: 'brand_id',
        accessor: 'brand_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase col-10 col-lg-3',
        hideColumn: true,
      },
      {
        Header: 'Nombre',
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
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'name', desc: false }], hiddenColumns: ['brand_id'] },
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

  const { getBrands, inactivateBrands } = useBrands({ term, pageIndex, pageSize, sortBy });
  const { isSuccess: isBrandsDataSuccess, data: BrandsData } = getBrands;

  useEffect(() => {
    if (isBrandsDataSuccess) {
      setData(BrandsData.items);
      setPageCount(BrandsData.pageCount);
    }
  }, [isBrandsDataSuccess, BrandsData]);

  const deleteItems = useCallback(
    async (values) => {
      inactivateBrands.mutateAsync(values);
    },
    [dispatch]
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
                <BreadcrumbList items={breadcrumbs} />
              </Col>
              {userHasPermission('C_BRANDS') && (
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
                  {userHasPermission('C_BRANDS') && <ControlsAdd tableInstance={tableInstance} />}
                  {userHasPermission('U_BRANDS') && <ControlsEdit tableInstance={tableInstance} />}
                  {userHasPermission('D_BRANDS') && (
                    <ControlsDelete
                      tableInstance={tableInstance}
                      deleteItems={deleteItems}
                      modalTitle="¿Desea eliminar la marca seleccionada?"
                      modalDescription="La marca seleccionada se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                      type="brand"
                      tipo="marca"
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
          <MarcasModalAddEdit tableInstance={tableInstance} apiParms={{ term, pageIndex, pageSize, sortBy }} />
        </Col>
      </Row>
    </>
  );
};
export default Marcas;
