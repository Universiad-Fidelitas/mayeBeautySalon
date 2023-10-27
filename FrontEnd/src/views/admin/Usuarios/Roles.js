/* eslint-disable no-plusplus */
import React, { useEffect, useState, useCallback } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import axios from 'axios';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { SERVICE_URL } from 'config.js';
import { baseApi } from 'api/apiConfig';
import ButtonsAddNew from '../../../components/datatables/roles/components/ButtonsAddNew';
import ControlsPageSize from '../../../components/datatables/roles/components/ControlsPageSize';
import ControlsAdd from '../../../components/datatables/roles/components/ControlsAdd';
import ControlsEdit from '../../../components/datatables/roles/components/ControlsEdit';
import ControlsDelete from '../../../components/datatables/roles/components/ControlsDelete';
import ControlsSearch from '../../../components/datatables/roles/components/ControlsSearch';
import ModalAddEdit from '../../../components/datatables/roles/components/ModalAddEdit';
import Table from '../../../components/datatables/roles/components/Table';
import TablePagination from '../../../components/datatables/roles/components/TablePagination';

const Roles = () => {
  const title = 'Roles de usuario';
  const description = 'Server side api implementation.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'usuarios', text: 'Usuarios' },
    { to: 'usuarios/roles', title: 'Roles' },
  ];

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
        Cell: ({ cell }) => {
          return (
            <a
              className="list-item-heading body"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {cell.value}
            </a>
          );
        },
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

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');

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
      initialState: { pageIndex: 0, sortBy: [{ id: 'name', desc: false }], hiddenColumns: ['rol_id'] },
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

  const fetchData = useCallback( async () => {
    const response = await baseApi.post('/rols', { term, sortBy, pageIndex, pageSize });
    const { items, pageCount: pCount } = response.data;
    setData(items);
    setPageCount(pCount);
  }, [sortBy, pageIndex, pageSize, term]);

  const addItem = React.useCallback(
    async ({ item }) => {
      document.body.classList.add('spinner');
      const response = await axios.post(`${SERVICE_URL}/datatable`, { sortBy, pageSize, pageIndex, item });
      setTimeout(() => {
        const { items, pageCount: pCount } = response.data;
        setData(items);
        setPageCount(pCount);
        document.body.classList.remove('spinner');
      }, 1000);
    },
    [sortBy, pageIndex, pageSize]
  );

  const editItem = React.useCallback(
    async ({ item }) => {
      console.log(item)
      document.body.classList.add('spinner');
      const response = await axios.put(`${SERVICE_URL}/datatable`, { sortBy, pageSize, pageIndex, item });
      setTimeout(() => {
        const { items, pageCount: pCount } = response.data;
        setData(items);
        setPageCount(pCount);
        document.body.classList.remove('spinner');
      }, 1000);
    },
    [sortBy, pageIndex, pageSize]
  );

  const deleteItems = React.useCallback(
    async ({ ids }) => {
      document.body.classList.add('spinner');
      const response = await axios.delete(`${SERVICE_URL}/datatable`, { sortBy, pageSize, pageIndex, ids });
      setTimeout(() => {
        const { items, pageCount: pCount } = response.data;
        setData(items);
        setPageCount(pCount);
        document.body.classList.remove('spinner');
      }, 1000);
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  useEffect(() => {
    fetchData();
  }, [sortBy, fetchData, pageIndex, pageSize, term]);

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
                  <ControlsAdd tableInstance={tableInstance} /> <ControlsEdit tableInstance={tableInstance} />{' '}
                  <ControlsDelete tableInstance={tableInstance} deleteItems={deleteItems} />
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
          <ModalAddEdit tableInstance={tableInstance} addItem={addItem} editItem={editItem} />
        </Col>
      </Row>
    </>
  );
};

export default Roles;
