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
import { getLogs, postLog } from 'store/logs/logsThunk'; // Update with your actual imports
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';

const Logs = () => {
  const { formatMessage: f } = useIntl();
  const title = 'Logs';
  const description = 'Server side API implementation for logging.';
  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/admin', text: f({ id: 'Admin' }) },
    { to: '/admin/logs', title: 'Logs' },
  ];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const dispatch = useDispatch();
  const { isLogsLoading, logs, pageCount } = useSelector((state) => state.logs || {}); // Ensure state.logs is defined

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'ID',
        accessor: 'log_id',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Acción',
        accessor: 'action',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Actividad',
        accessor: 'activity',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Tabla Afectada',
        accessor: 'affected_table',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Fecha',
        accessor: 'date',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
        Cell: ({ value }) => {
          const dateObject = new Date(value);
          const dateString = dateObject.toLocaleDateString();
          const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `${dateString} ${timeString}`;
        },
      },
      {
        Header: 'Mensaje de Error',
        accessor: 'error_message',
        sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-30',
      },
      {
        Header: 'Usuario',
        accessor: 'user_id',
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
      isOpenAddEditModal,
      setIsOpenAddEditModal,
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount,
      initialState: { pageIndex: 0, pageSize: 5, sortBy: [{ id: 'date', desc: true }], hiddenColumns: ['log_id'] },
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
    dispatch(getLogs({ term, sortBy, pageIndex, pageSize }));
  }, [sortBy, pageIndex, pageSize, term]);

  useEffect(() => {
    if (logs.length > 0) {
      setData(logs);
    }
  }, [isLogsLoading]);

  const addItem = useCallback(
    async (values) => {
      dispatch(postLog(values));
    },
    [sortBy, pageIndex, pageSize]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    message: Yup.string()
      .required('El mensaje es requerido')
      .min(3, 'El mensaje debe tener al menos 3 caracteres')
      .max(255, 'El mensaje no puede tener más de 255 caracteres'),
  });

  const formFields = [
    {
      id: 'message',
      label: 'Mensaje del log',
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
            </Row>
          </div>

          <div>
         
            <Row className="mb-3">
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
          <ModalAddEdit tableInstance={tableInstance} addItem={addItem} validationSchema={validationSchema} formFields={formFields} />
        </Col>
      </Row>
    </>
  );
};

export default Logs;
