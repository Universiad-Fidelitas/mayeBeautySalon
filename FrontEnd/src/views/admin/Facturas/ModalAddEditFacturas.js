import React, { useCallback, useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import { Button, Card, Col, FormCheck, Modal, Row } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import 'react-dropzone-uploader/dist/styles.css';
import { useStock } from 'hooks/react-query/useStock';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { baseApi } from 'api/apiConfig';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useGetMonthAppointments } from 'hooks/react-query/useAppointments';
import ReactToPrint from 'react-to-print';
import { useBills } from 'hooks/react-query/useBills';
import NumberFormat from 'react-number-format';

export const ModalAddEditFacturas = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: productsData } = useStock();

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const { data: getMonthData, isSuccess: isGetMonthDataSuccess } = useGetMonthAppointments();
  const { getOneBill } = useBills({ term: '', pageIndex: 0, pageSize: 5, sortBy: [{ id: 'bills_id', desc: false }] });

  const { monthAppointments } = getMonthData || {};
  const [isIdCardDisabled, setIsIdCardDisabled] = useState(false);
  const [IsUserFound, setIsUserFound] = useState(false);
  const [IsUserFound2, setIsUserFound2] = useState(false);
  const { formatMessage: f } = useIntl();
  const productsDataDropdown = useMemo(
    () =>
      productsData?.items.map(({ product_id, name, total_amount }) => {
        return { value: product_id, label: name, amount: total_amount };
      }),
    [productsData]
  );
  const idTypeDropdown = useMemo(() => {
    return [
      { value: 'nacional', label: 'Nacional' },
      { value: 'extranjero', label: 'Extranjero' },
    ];
  }, []);
  const appointmentOptions = useMemo(
    () =>
      getMonthData?.monthAppointments?.map((appointment) => {
        return { value: appointment.id, label: `${appointment.id} - ${appointment.title} - ${appointment.start}` };
      }),
    [getMonthData]
  );
  const initialValues = {
    status: '',
    payment_type: '',
    sinpe_phone_number: '',
    description: '',
    id_card: '',
    id_card_type: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    payment_id: '',
    inventory_id: '',
    dataToInsert: [{ product_id: '', amount: '', invetory_products_id: '' }],
  };
  const [formValues, setFormValues] = useState(selectedFlatRows.length === 1 ? selectedFlatRows[0].original : initialValues);

  const onSubmit = (values) => {
    setFormValues(values);
    console.log('karo', formValues);
    if (values.desciption === null) {
      values.description = '';
    }
    delete values.activated;
    delete values.appointment_date;
    if (values.appointment_id === null) {
      delete values.appointment_id;
    }
    delete values.appointment_price;
    delete values.inventory_date;
    delete values.inventory_price;
    delete values.user_id;
    delete values.voucher_path;
    let isValid = true;
    if (values.payment_id !== null) {
      if (values.payment_id === '') {
        values.payment_id = 0;
      }
    }
    if (values.inventory_id !== null) {
      if (values.inventory_id === '') {
        values.inventory_id = 0;
      }

      if (values.dataToInsert.length > 0) {
        if (values.dataToInsert[0].invetory_products_id === '') {
          values.dataToInsert[0].invetory_products_id = 0;
        }
        values.dataToInsert.forEach((item, index) => {
          const product = productsDataDropdown.find((p) => p.value === item.product_id);
          if (product && Number(product.amount) < item.amount) {
            isValid = false;
            console.log(index);
            toast(f({ id: `El producto en la posición ${index + 1} no tiene suficiente cantidad para remover.` }), { className: 'danger' });
          }
        });
      }
    }
    let resultadoAdd;
    if (isValid) {
      if (selectedFlatRows.length === 1) {
        editItem(values);
      } else {
        addItem(values).then((result) => {
          resultadoAdd = result.bills_id;
          getOneBill(resultadoAdd)
            .then((billData) => {
              console.log('Bill data:', billData.billFound);
              setFormValues(billData.billFound);
            })
            .catch((error) => {
              console.error('Error fetching bill data:', error);
            });
          setConfirmDeleteModal(true);
        });
      }

      setIsOpenAddEditModal(false);
      setIsUserFound(false);
      setIsIdCardDisabled(true);
    }
  };
  const SearchUser = async (id_card, form) => {
    setIsUserFound(true);
    const { data } = await baseApi.post('/appointments/user-prefill', { id_card });
    const { userPrefillData } = data;
    if (userPrefillData.length) {
      setIsUserFound2(true);
      form.setFieldValue('first_name', userPrefillData[0].first_name);
      form.setFieldValue('last_name', userPrefillData[0].last_name);
      form.setFieldValue('email', userPrefillData[0].email);
      form.setFieldValue('phone', userPrefillData[0].phone);
    } else {
      setIsUserFound2(false);
      form.setFieldValue('first_name', '');
      form.setFieldValue('last_name', '');
      form.setFieldValue('email', '');
      form.setFieldValue('phone', '');
    }
  };
  const CustomSelect = ({ field, form, options }) => (
    <Select
      classNamePrefix="react-select"
      options={options}
      name={field.name}
      value={options ? options.find((option) => option.value === field.value) : ''}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      placeholder="Seleccione una opción"
    />
  );

  const optionsStatus = [
    { value: 'Pagado', label: 'Pagado' },
    { value: 'Pendiente', label: 'Pendiente de Pago' },
    { value: 'Anulado', label: 'Anulado' },
  ];
  const optionsPayment = [
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'sinpe', label: 'Sinpe' },
    { value: 'transferencia', label: 'Transferencia' },
  ];

  const CustomSelect2 = ({ field, form, options }) => (
    <Select
      classNamePrefix="react-select"
      options={options}
      name={field.name}
      value={options ? options.find((option) => option.value === field.value) : ''}
      onChange={(option) => {
        form.setFieldValue(field.name, option.value);
        if (option.value) {
          setIsIdCardDisabled(false);
        } else {
          setIsIdCardDisabled(true);
        }
      }}
      placeholder="Seleccione una opcion"
    />
  );

  const PrintValuesComponent = forwardRef(({ values }, ref) => {
    const showDetail = values.inventory_id !== null;
    const showDetail2 = values.appointment_id ? !(values.appointment_id === null || values.appointment_id === 0) : false;
    const inventoryPrice = values.inventory_price !== null ? values.inventory_price : 0;
    const appointmentPrice = values.appointment_price !== null ? parseFloat(values.appointment_price) : 0;

    const totalPrice = inventoryPrice + appointmentPrice;
    return (
      <div ref={ref} className="mx-6">
        <div className="d-flex justify-content-center">
          <h2 className="mx-auto">Factura Maye Beauty Salon</h2>
        </div>
        <div className="d-flex justify-content-center">
          <h5 className="mx-auto">Teléfono: 7284-0695</h5>
        </div>
        <hr className="mb-3 mt-4" />
        <p>El pago se realizó en {values.payment_type}</p>
        <div className="d-flex d-flex justify-content-start">
          <p className="font-weight-bold">Estado: </p>
          <p> {values.status}</p>
        </div>
        <div className="d-flex d-flex justify-content-evenly">
          <p className="font-weight-bold">Nombre del cliente:</p>
          <p>
            {values.first_name} {values.last_name}
          </p>

          <p className="font-weight-bold">Correo: </p>
          <p>{values.email}</p>
        </div>
        <div>
          <h4 className="font-weight-bold">Detalle: {}</h4>
        </div>
        <div className="mx-3">
          {showDetail && (
            <>
              <h5 className="font-weight-bold">Venta de productos</h5>
              <div className="mx-3">
                <p>Descripción: {values.description}</p>
                <div className="d-flex d-flex justify-content-between">
                  <p className="font-weight-bold">Fecha de la venta: </p>
                  <p>
                    {(() => {
                      const dateObject = new Date(values.inventory_date);
                      const dateString = dateObject.toLocaleDateString();
                      const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return `${dateString} ${timeString}`;
                    })()}
                  </p>
                </div>

                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.dataToInsert.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{item.name}</th>
                        <td>{item.amount}</td>
                        <td>₡{item.amount * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <hr className="mb-3 mt-4" />
            </>
          )}
          {showDetail2 && (
            <>
              <h5 className="font-weight-bold">Cita</h5>
              <div className="mx-3">
                <div className="d-flex d-flex justify-content-between">
                  <p className="font-weight-bold">Fecha de la cita: </p>
                  <p>
                    {(() => {
                      const dateObject = new Date(values.appointment_date);
                      const dateString = dateObject.toLocaleDateString();
                      const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return `${dateString} ${timeString}`;
                    })()}
                  </p>
                </div>

                <div className="d-flex d-flex justify-content-between">
                  <p className="font-weight-bold">Precio total de la cita: </p>
                  <p>₡{values.appointment_price}</p>
                </div>
              </div>
              <hr className="mb-3 mt-4" />
            </>
          )}
        </div>
        <div className="mx-6">
          <div className="d-flex d-flex justify-content-between">
            <p className="font-weight-bold">Total a pagar</p>
            <p className="font-weight-bold">₡{totalPrice}</p>
          </div>
        </div>
      </div>
    );
  });
  const componentRef = useRef();

  return (
    <>
      <Modal
        className="modal-right large"
        show={isOpenAddEditModal}
        onHide={() => {
          setIsOpenAddEditModal(false);
          setIsUserFound(false);
          setIsIdCardDisabled(true);
        }}
      >
        <Formik
          initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              setFormValues(values);
            }, [values]);

            return (
              <>
                <Form>
                  <Modal.Header>
                    <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedFlatRows.length === 1 && (
                      <>
                        <div style={{ display: 'none' }}>
                          <PrintValuesComponent ref={componentRef} values={values} />
                        </div>
                        <h4 className="mb-3">Imprimir Factura</h4>
                        <ReactToPrint
                          trigger={() => (
                            <Button variant="secondary">
                              <CsLineIcons icon="print" />
                            </Button>
                          )}
                          content={() => componentRef.current}
                        />
                        <hr className="mb-3 mt-4" />
                        <h4 className="mb-3">Factura</h4>
                      </>
                    )}

                    <Row className="g-3 mb-3">
                      <Col className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Estado del Pago</label>
                          <Field className="form-control" name="status" id="status" component={CustomSelect} options={optionsStatus} required />
                          <ErrorMessage name="status" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Tipo de Pago</label>
                          <Field className="form-control" name="payment_type" id="payment_type" component={CustomSelect} options={optionsPayment} required />
                          <ErrorMessage name="payment_type" component="div" className="text-danger" />
                        </div>
                      </Col>
                    </Row>
                    {values.payment_type === 'sinpe' && (
                      <div className="mb-3" key="sinpe_phone_number">
                        <label className="form-label">Número de SINPE</label>
                        <NumberFormat
                          className="form-control"
                          mask="_"
                          format="####-####"
                          allowEmptyFormatting
                          value={values.sinpe_phone_number}
                          onValueChange={({ value }) => {
                            setFieldValue('sinpe_phone_number', value);
                          }}
                        />

                        <ErrorMessage name="sinpe_phone_number" component="div" className="text-danger" />
                      </div>
                    )}
                    <div className="mb-3" key="description">
                      <label className="form-label">Descripción</label>
                      <Field as="textarea" className="form-control" type="text" id="description" name="description" />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </div>
                    {selectedFlatRows.length === 1 && (
                      <>
                        {' '}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="appointment_id">
                            Cita
                          </label>
                          <Field
                            className="form-control"
                            name="appointment_id"
                            id="appointment_id"
                            component={CustomSelect}
                            options={appointmentOptions}
                            required
                          />
                          <ErrorMessage name="appointment_id" className="text-danger" component="div" />
                        </div>
                      </>
                    )}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="id_card_type">
                        Tipo de Cedula
                      </label>
                      <Field className="form-control" name="id_card_type" id="id_card_type" component={CustomSelect2} options={idTypeDropdown} required />
                      <ErrorMessage name="id_card_type" className="text-danger" component="div" />
                    </div>
                    <Row className="g-3 mb-3">
                      {selectedFlatRows.length === 1 && setIsIdCardDisabled(false)}
                      <Col className="col-9">
                        <div className="mb-3" key="id_card">
                          <label className="form-label">Cédula</label>
                          <NumberFormat
                            className="form-control"
                            mask="_"
                            format={values.id_card_type && values.id_card_type !== 'nacional' ? '####-####-####' : '#-####-####'}
                            allowEmptyFormatting
                            value={values.id_card}
                            onValueChange={({ value }) => {
                              setFieldValue('id_card', value);
                            }}
                            id="id_card"
                            name="id_card"
                            disabled={!values.id_card_type}
                          />

                          <ErrorMessage name="id_card" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col className="col-3">
                        <div className="mb-3">
                          <label className="form-label">Buscar</label>
                          <br />
                          <Button variant="primary" onClick={() => SearchUser(values.id_card, { setFieldValue })} disabled={!values.id_card}>
                            Buscar
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    {IsUserFound && (
                      <>
                        <Row className="g-3 mb-3">
                          <Col className="col-6">
                            <div className="mb-3" key="first_name">
                              <label className="form-label">Nombre</label>
                              <Field className="form-control" type="text" id="first_name" name="first_name" disabled={IsUserFound2} />
                              <ErrorMessage name="first_name" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col className="col-6">
                            <div className="mb-3" key="last_name">
                              <label className="form-label">Apellido</label>
                              <Field className="form-control" type="text" id="last_name" name="last_name" disabled={IsUserFound2} />
                              <ErrorMessage name="last_name" component="div" className="text-danger" />
                            </div>
                          </Col>
                        </Row>
                        <Row className="g-3 mb-3">
                          <Col className="col-8">
                            <div className="mb-3" key="email">
                              <label className="form-label">Correo eletrónico</label>
                              <Field className="form-control" type="text" id="email" name="email" disabled={IsUserFound2} />
                              <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>
                          </Col>
                          <Col className="col-4">
                            <div className="mb-3" key="phone">
                              <label className="form-label">Número de teléfono</label>
                              <Field className="form-control" type="text" id="phone" name="phone" disabled={IsUserFound2} />
                              <ErrorMessage name="phone" component="div" className="text-danger" />
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                    <FieldArray name="dataToInsert">
                      {({ push, remove }) => (
                        <div>
                          {values.dataToInsert.map((_, index) => (
                            <div className="row" key={index}>
                              <Row className="g-3 mb-3 m-0">
                                <Col className="col-6 m-0">
                                  {productsDataDropdown && (
                                    <>
                                      <div className="mb-3">
                                        <label className="form-label" htmlFor={`dataToInsert.${index}.product_id`}>
                                          Productos
                                        </label>

                                        <Field
                                          className="form-control"
                                          name={`dataToInsert.${index}.product_id`}
                                          id="product_id"
                                          component={CustomSelect}
                                          options={productsDataDropdown}
                                        />
                                        <ErrorMessage name={`dataToInsert.${index}.product_id`} className="text-danger" component="div" />
                                      </div>
                                    </>
                                  )}
                                </Col>
                                <Col className="col-3 m-0">
                                  <div className="mb-3">
                                    <label className="form-label" htmlFor={`dataToInsert.${index}.amount`}>
                                      Cantidad
                                    </label>
                                    <Field name={`dataToInsert.${index}.amount`} className="form-control" type="number" id="amount" />
                                    <ErrorMessage name={`dataToInsert.${index}.amount`} component="div" className="text-danger" />
                                  </div>
                                </Col>
                                <Col className="col-3 m-0">
                                  <Row className="g-3 mb-3 m-0">
                                    {index > 0 && (
                                      <Col className="col-6 m-0">
                                        <div className="mb-3">
                                          <Button variant="danger w-100 p-2 mt-5" onClick={() => remove(index)}>
                                            <CsLineIcons icon="bin" />
                                          </Button>
                                        </div>
                                      </Col>
                                    )}

                                    <Col className="col-6 m-0">
                                      {values.dataToInsert.length - 1 === index && (
                                        <Button variant="success w-100 p-2 mt-5" onClick={() => push({ product_id: '', amount: '', invetory_products_id: 0 })}>
                                          <CsLineIcons icon="plus" />
                                        </Button>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setIsOpenAddEditModal(false);
                        setIsUserFound(false);
                        setIsIdCardDisabled(true);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      {selectedFlatRows.length === 1 ? 'Hecho' : 'Agregar'}
                    </Button>
                  </Modal.Footer>
                </Form>
              </>
            );
          }}
        </Formik>
      </Modal>
      <Modal className="modal-close-out" show={confirmDeleteModal} onHide={() => setConfirmDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">¿Desea Imprimir la factura?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Desea imprimir la factura?</p>
          <div style={{ display: 'none' }}>
            <PrintValuesComponent ref={componentRef} values={formValues} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-body" onClick={() => setConfirmDeleteModal(false)}>
            Cerrar
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button variant="secondary">
                <CsLineIcons icon="print" />
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
