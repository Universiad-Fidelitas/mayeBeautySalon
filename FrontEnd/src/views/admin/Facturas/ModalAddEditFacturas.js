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

export const ModalAddEditFacturas = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: productsData } = useStock();
  const { data: getMonthData, isSuccess: isGetMonthDataSuccess } = useGetMonthAppointments();
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

  const onSubmit = (values) => {
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

    if (isValid) {
      if (selectedFlatRows.length === 1) {
        editItem(values);
      } else {
        addItem(values);
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
    { value: 'done', label: 'Pagado' },
    { value: 'pending', label: 'Pendiente de Pago' },
    { value: 'cancelled', label: 'Cancelado' },
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
    console.log('values', values);
    const showDetail = values.inventory_id !== null;
    const showDetail2 = values.appointment_id !== null;
    const inventoryPrice = values.inventory_price !== null ? values.inventory_price : 0;
    const appointmentPrice = values.appointment_price !== null ? parseFloat(values.appointment_price) : 0;

    const totalPrice = inventoryPrice + appointmentPrice;
    return (
      <div ref={ref}>
        <h2>Factura Maye beauty Salon</h2>
        <p>El pago se realizó en {values.payment_type}</p>
        <p>Estado: {values.status}</p>
        <p>
          Nombre del cliente: {values.first_name} {values.last_name}
        </p>
        <p>Correo: {values.email}</p>
        <p>Detalle: {}</p>
        {showDetail && (
          <>
            <p>Descripción: {values.description}</p>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {values.dataToInsert.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    <td>{item.amount * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {showDetail2 && (
          <>
            <p>Fecha de la cita: {values.appointment_date}</p>
            <p>Precio total de la cita: {values.appointment_price}</p>
          </>
        )}
        <hr className="mb-3 mt-4" />
        <table>
          <tbody>
            <tr>
              <td>Total a pagar</td>
              <td>{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef = useRef();
  return (
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
        {({ values, setFieldValue }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>Agregar</Modal.Title>
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
                    <ErrorMessage style={{ color: 'red' }} name="status" component="div" className="field-error" />
                  </div>
                </Col>
                <Col className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Tipo de Pago</label>
                    <Field className="form-control" name="payment_type" id="payment_type" component={CustomSelect} options={optionsPayment} required />
                    <ErrorMessage style={{ color: 'red' }} name="payment_type" component="div" className="field-error" />
                  </div>
                </Col>
              </Row>
              <div className="mb-3" key="sinpe_phone_number">
                <label className="form-label">Número de SINPE</label>
                <Field className="form-control" type="text" id="sinpe_phone_number" name="sinpe_phone_number" />
                <ErrorMessage style={{ color: 'red' }} name="sinpe_phone_number" component="div" />
              </div>
              <div className="mb-3" key="description">
                <label className="form-label">Descripción</label>
                <Field as="textarea" className="form-control" type="text" id="description" name="description" />
                <ErrorMessage style={{ color: 'red' }} name="description" component="div" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="appointment_id">
                  Cita
                </label>
                <Field className="form-control" name="appointment_id" id="appointment_id" component={CustomSelect} options={appointmentOptions} required />
                <ErrorMessage style={{ color: 'red' }} name="appointment_id" className="field-error" component="div" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="id_card_type">
                  Tipo de Cedula
                </label>
                <Field className="form-control" name="id_card_type" id="id_card_type" component={CustomSelect2} options={idTypeDropdown} required />
                <ErrorMessage style={{ color: 'red' }} name="id_card_type" className="field-error" component="div" />
              </div>
              <Row className="g-3 mb-3">
                {selectedFlatRows.length === 1 && setIsIdCardDisabled(false)}
                <Col className="col-9">
                  <div className="mb-3" key="id_card">
                    <label className="form-label">Cédula</label>
                    <Field className="form-control" type="text" id="id_card" name="id_card" disabled={!values.id_card_type} />
                    <ErrorMessage style={{ color: 'red' }} name="id_card" component="div" />
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
                        <ErrorMessage style={{ color: 'red' }} name="first_name" component="div" />
                      </div>
                    </Col>
                    <Col className="col-6">
                      <div className="mb-3" key="last_name">
                        <label className="form-label">Apellido</label>
                        <Field className="form-control" type="text" id="last_name" name="last_name" disabled={IsUserFound2} />
                        <ErrorMessage style={{ color: 'red' }} name="last_name" component="div" />
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-3 mb-3">
                    <Col className="col-8">
                      <div className="mb-3" key="email">
                        <label className="form-label">Correo eletrónico</label>
                        <Field className="form-control" type="text" id="email" name="email" disabled={IsUserFound2} />
                        <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
                      </div>
                    </Col>
                    <Col className="col-4">
                      <div className="mb-3" key="phone">
                        <label className="form-label">Número de teléfono</label>
                        <Field className="form-control" type="text" id="phone" name="phone" disabled={IsUserFound2} />
                        <ErrorMessage style={{ color: 'red' }} name="phone" component="div" />
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
                                  <ErrorMessage style={{ color: 'red' }} name={`dataToInsert.${index}.product_id`} className="field-error" component="div" />
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
                              <ErrorMessage style={{ color: 'red' }} name={`dataToInsert.${index}.amount`} component="div" className="field-error" />
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
                                  <Button variant="success w-100 p-2 mt-5" onClick={() => push({ product_id: '', amount: '' })}>
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
        )}
      </Formik>
    </Modal>
  );
};
