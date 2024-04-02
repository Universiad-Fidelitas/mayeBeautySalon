import React, { useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import 'react-dropzone-uploader/dist/styles.css';
import { useStock } from 'hooks/react-query/useStock';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

export const ModalAddEditFacturas = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const { data: productsData } = useStock();
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
  const initialValues = {
    status: '',
    payment_type: '',
    sinpe_phone_number: '',
    description: '',
    id_card: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    payment_id: '',
    inventory_id: '',
    dataToInsert: [{ product_id: '', amount: '', invetory_products_id: '' }],
  };

  const onSubmit = (values) => {
    delete values.activated;
    delete values.appointment_date;
    delete values.appointment_id;
    delete values.appointment_price;
    delete values.inventory_date;
    delete values.inventory_price;
    delete values.user_id;
    delete values.voucher_path;
    let isValid = true;
    if (values.payment_id === '') {
      values.payment_id = 0;
    }
    if (values.inventory_id === '') {
      values.inventory_id = 0;
    }
    if (values.dataToInsert[0].invetory_products_id === '') {
      values.dataToInsert[0].invetory_products_id = 0;
    }

    values.dataToInsert.forEach((item, index) => {
      const product = productsDataDropdown.find((p) => p.value === item.product_id);
      console.log('product', product);
      if (product && Number(product.amount) < item.amount) {
        isValid = false;
        // ARREGLAR ESTO USAR UN TOAST
        console.log(index);
        toast(f({ id: `El producto en la posición ${index + 1} no tiene suficiente cantidad para remover.` }), { className: 'danger' });
      }
    });

    if (isValid) {
      if (selectedFlatRows.length === 1) {
        editItem(values);
      } else {
        addItem(values);
      }
      setIsOpenAddEditModal(false);
    }
  };
  const CustomSelect = ({ field, form, options }) => (
    <Select
      classNamePrefix="react-select"
      options={options}
      name={field.name}
      value={options ? options.find((option) => option.value === field.value) : ''}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      placeholder="Seleccione una opcion"
    />
  );

  const optionsStatus = [
    { value: 'done', label: 'Pagado' },
    { value: 'pending', label: 'Pendiente de Pago' },
  ];
  const optionsPayment = [
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'sinpe', label: 'Sinpe' },
  ];
  return (
    <Modal className="modal-right large" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik
        initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <Form>
            <Modal.Header>
              <Modal.Title>Agregar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Estado del Pago</label>
                <Field className="form-control" name="status" id="status" component={CustomSelect} options={optionsStatus} required />
                <ErrorMessage style={{ color: 'red' }} name="status" component="div" className="field-error" />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Pago</label>
                <Field className="form-control" name="payment_type" id="payment_type" component={CustomSelect} options={optionsPayment} required />
                <ErrorMessage style={{ color: 'red' }} name="payment_type" component="div" className="field-error" />
              </div>
              <div className="mb-3" key="description">
                <label className="form-label">Descripción</label>
                <Field as="textarea" className="form-control" type="text" id="description" name="description" />
                <ErrorMessage style={{ color: 'red' }} name="description" component="div" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="id_card_type">
                  Tipo de Cedula
                </label>
                <Field className="form-control" name="id_card_type" id="id_card_type" component={CustomSelect} options={idTypeDropdown} required />
                <ErrorMessage style={{ color: 'red' }} name="id_card_type" className="field-error" component="div" />
              </div>
              {formFields.map(({ id, label, type }) => (
                <div className="mb-3" key={id}>
                  <label className="form-label">{label}</label>
                  <Field className="form-control" type={type} id={id} name={id} />
                  <ErrorMessage style={{ color: 'red' }} name={id} component="div" />
                </div>
              ))}

              <FieldArray name="dataToInsert">
                {({ push, remove }) => (
                  <div>
                    {values.dataToInsert.map((_, index) => (
                      <div className="row" key={index}>
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
                                required
                              />
                              <ErrorMessage style={{ color: 'red' }} name={`dataToInsert.${index}.product_id`} className="field-error" component="div" />
                            </div>
                          </>
                        )}

                        <div className="mb-3">
                          <label className="form-label" htmlFor={`dataToInsert.${index}.amount`}>
                            Cantidad
                          </label>
                          <Field name={`dataToInsert.${index}.amount`} className="form-control" type="number" id="amount" />
                          <ErrorMessage style={{ color: 'red' }} name={`dataToInsert.${index}.amount`} component="div" className="field-error" />
                        </div>
                        {index > 0 && (
                          <div className="mb-3">
                            <Button variant="danger" onClick={() => remove(index)}>
                              Remover Producto
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button variant="primary" onClick={() => push({ product_id: '', amount: '', invetory_products_id: 0 })}>
                      Agregar Producto
                    </Button>
                  </div>
                )}
              </FieldArray>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
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
