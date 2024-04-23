import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Field } from 'formik';
import {
  ModalAddEdit,
  ButtonsAddNew,
  ControlsPageSize,
  ControlsAdd,
  ControlsEdit,
  ControlsSearch,
  ControlsDelete,
  ControlsExportCSV,
  Table,
  TablePagination,
  ControlsDatePicker,
} from 'components/datatables';
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useRowState, useAsyncDebounce } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import HtmlHead from 'components/html-head/HtmlHead';
import { useBills } from 'hooks/react-query/useBills';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import * as Yup from 'yup';
import { SelectField } from 'components/SelectField';
import { useUserPermissions } from 'hooks/useUserPermissions';
import { ModalAddEditFacturas } from './ModalAddEditFacturas';

const Facturas = () => {
  const { userHasPermission } = useUserPermissions();
  const { formatMessage: f } = useIntl();
  const title = 'Facturas';
  const description = 'Server side api implementation.';
  const breadcrumbs = [];
  const [data, setData] = useState([]);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [term, setTerm] = useState('');
  const [term2, setTerm2] = useState('');
  const [term3, setTerm3] = useState('');
  const [pageCount, setPageCount] = useState();
  const dispatch = useDispatch();

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'No. Factura',
        accessor: 'bills_id',
        hideColumn: true,

        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Activado',
        accessor: 'activated',
        sortable: true,
        hideColumn: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Correo electrónico',
        accessor: 'email',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-20',
      },
      {
        Header: 'Nombre',
        accessor: 'first_name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Apellido',
        accessor: 'last_name',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'User ID',
        accessor: 'user_id',
        sortable: true,
        hideColumn: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Telefóno',
        accessor: 'phone',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Cédula',
        accessor: 'id_card',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Tipo de cédula',
        accessor: 'id_card_type',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Pago ID',
        accessor: 'payment_id',
        sortable: true,
        hideColumn: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Tipo pago',
        accessor: 'payment_type',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-15',
      },
      {
        Header: 'Número de Sinpe',
        accessor: 'sinpe_phone_number',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Estado de Pago',
        accessor: 'status',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-10',
      },
      {
        Header: 'Inventory ID',
        accessor: 'inventory_id',
        sortable: true,
        hideColumn: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Precio inventorio',
        accessor: 'inventory_price',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Descripción',
        accessor: 'description',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Fecha de Venta',
        accessor: 'inventory_date',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-20',
        Cell: ({ value }) => {
          if (value === null) {
            return '';
          }
          const dateObject = new Date(value);
          const dateString = dateObject.toLocaleDateString();
          const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `${dateString} ${timeString}`;
        },
      },
      {
        Header: 'appointment id',
        accessor: 'appointment_id',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-30',
      },
      {
        Header: 'Fecha de Cita',
        accessor: 'appointment_date',
        sortable: true,
        headerClassName: 'text-muted text-medium text-uppercase w-20',
        Cell: ({ value }) => {
          if (value === null) {
            return '';
          }
          const dateObject = new Date(value);
          const month = dateObject.getMonth() + 1;
          const day = dateObject.getDate();
          const year = dateObject.getFullYear();
          const hours = dateObject.getHours();
          const minutes = String(dateObject.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format
          return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
        },
      },
      {
        Header: 'Precio de Cita',
        accessor: 'appointment_price',
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
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [{ id: 'bills_id', desc: false }],
        hiddenColumns: [
          'inventory_id',
          'payment_id',
          'user_id',
          'first_name',
          'last_name',
          'payment_type',
          'appointment_id',
          'sinpe_phone_number',
          'activated',
          'description',
          'phone',
          'appointment_price',
          'inventory_price',
        ],
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
  const { getBills, deleteBills, addBill, updateBill, getBillsCSV } = useBills({ term, term2, term3, pageIndex, pageSize, sortBy });
  const { isSuccess: isBillsDataSuccess, data: billsData } = getBills;
  const { data: billsCSVData } = getBillsCSV;
  useEffect(() => {
    if (isBillsDataSuccess) {
      setData(billsData.items);
      setPageCount(billsData.pageCount);
    }
  }, [isBillsDataSuccess, billsData]);

  const deleteItems = useCallback(
    async (values) => {
      const valuesAsString = values.join(',');
      deleteBills.mutateAsync({ bills_id: valuesAsString });
    },
    [deleteBills]
  );

  const editItem = useCallback(
    async (values) => {
      updateBill.mutateAsync({ values });
    },
    [updateBill]
  );

  const addItem = useCallback(
    async (values) => {
      const add = addBill.mutateAsync({ values });
      console.log('add', add);
      return add;
    },
    [addBill]
  );

  const searchItem = useAsyncDebounce((val) => {
    setTerm(val || undefined);
  }, 200);
  const searchItem2 = useAsyncDebounce((val) => {
    setTerm2(val || undefined);
  }, 200);
  const searchItem3 = useAsyncDebounce((val) => {
    setTerm3(val || undefined);
  }, 200);

  const validationSchema = Yup.object().shape({
    status: Yup.string().required('El estado del pago es requerido'),
    payment_type: Yup.string().required('El tipo de pago es requerido'),
    description: Yup.string()
      .min(3, 'La descripción debe tener al menos 3 caracteres')
      .max(100, 'La descripción no puede tener más de 100 caracteres')
      .nullable(),
    dataToInsert: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.string().required('El producto es requerido'),
        amount: Yup.number().min(1, 'La cantidad debe ser mayor a 0').typeError('La cantidad solo acepta números').required('La cantidad es requerida'),
      })
    ),
    id_card_type: Yup.string().required('El tipo de cedula es requerido'),
    id_card: Yup.string()
      .required(f({ id: 'helper.idCardRequired' }))
      .matches(/^\d+$/, f({ id: 'helper.idCardOnlyNumbers' }))
      .when('id_card_type', {
        is: 'nacional',
        then: Yup.string()
          .min(9, f({ id: 'helper.idCardMinSize' }))
          .max(9, f({ id: 'helper.idCardMaxSize' })),
        otherwise: Yup.string()
          .min(12, f({ id: 'helper.idCardMinSize2' }))
          .max(15, f({ id: 'helper.idCardMaxSize2' })),
      }),
    first_name: Yup.string()
      .required(f({ id: 'helper.nameRequired' }))
      .min(3, f({ id: 'helper.nameMinLength' }))
      .max(20, f({ id: 'helper.nameMaxLength' })),
    last_name: Yup.string()
      .required(f({ id: 'helper.lastnameRequired' }))
      .min(3, f({ id: 'helper.lastnameMinLength' }))
      .max(20, f({ id: 'helper.lastnameMaxLength' })),
    email: Yup.string()
      .email(f({ id: 'helper.emailInvalid' }))
      .required(f({ id: 'helper.emailRequired' })),
    phone: Yup.string()
      .matches(/^\d+$/, f({ id: 'helper.phoneOnlyNumbers' }))
      .min(8, f({ id: 'helper.phoneMinLength' }))
      .max(10, f({ id: 'helper.phoneMaxLength' }))
      .required(f({ id: 'helper.phoneRequired' })),
    sinpe_phone_number: Yup.string()
      .matches(/^\d+$/, f({ id: 'helper.phoneOnlyNumbers' }))
      .min(8, f({ id: 'helper.phoneMinLength' }))
      .max(10, f({ id: 'helper.phoneMaxLength' }))
      .when('payment_type', {
        is: 'sinpe',
        then: Yup.string().required('El número de SINPE es requerido'),
        otherwise: Yup.string(),
      }),
  });

  const formFields = [];

  return (
    <>
      <HtmlHead title={title} description={description} />

      <Row>
        <Col>
          <div className="page-title-container">
            <Row>
              <Col xs="12" md="7">
                <h1 className="mb-3 pb-0 display-4">{title}</h1>
              </Col>
              {userHasPermission('C_BILLS') && (
                <Col xs="12" md="5" className="d-flex align-items-start justify-content-end">
                  <ButtonsAddNew tableInstance={tableInstance} />
                </Col>
              )}
            </Row>
          </div>

          <div>
            <Row className="mb-3">
              <Col sm="12" md="4" lg="4" xxl="4">
                <div className="d-inline-block float-md-start me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
                  <ControlsSearch tableInstance={tableInstance} onChange={searchItem} />
                </div>
              </Col>
              <Col sm="12" md="4" lg="4" xxl="4">
                <div className="mb-1">
                  <ControlsDatePicker tableInstance={tableInstance} onChange={searchItem2} />
                </div>
              </Col>
              <Col sm="12" md="4" lg="4" xxl="4">
                <div className="mb-1">
                  <ControlsDatePicker tableInstance={tableInstance} onChange={searchItem3} />
                </div>
              </Col>
              <Col sm="12" md="12" lg="12" xxl="12" className="text-end">
                <div className="d-inline-block me-0 me-sm-3 float-start float-md-none">
                  {userHasPermission('C_BILLS') && <ControlsAdd tableInstance={tableInstance} />}{' '}
                  {userHasPermission('U_BILLS') && <ControlsEdit tableInstance={tableInstance} />}
                  {userHasPermission('D_BILLS') && (
                    <ControlsDelete
                      tableInstance={tableInstance}
                      deleteItems={deleteItems}
                      modalTitle="¿Desea eliminar la factura seleccionado?"
                      modalDescription="La factura seleccionado se pasará a inactivo y necesitarás ayuda de un administrador para volver a activarlo."
                      type="bills"
                      tipo="factura"
                    />
                  )}
                  <ControlsExportCSV tableInstance={billsCSVData && billsCSVData.items} type="bills" />
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
            <Row>
              <Col xs="8">
                <h6 className="text-primary font-weight-bold ">
                  Total de facturas:
                  {billsData && billsData.total && (
                    <p className="text-secondary font-weight-bold ">
                      {parseFloat(billsData.total).toLocaleString('es-CR', {
                        style: 'currency',
                        currency: 'CRC',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  )}
                </h6>
              </Col>
            </Row>
          </div>
          <ModalAddEditFacturas
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
export default Facturas;
