import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import 'react-dropzone-uploader/dist/styles.css';
import { PagosImageUploader } from 'components/ImageUploading/PaymentsImageUploader';

export const ModalAddEditPagos = ({ tableInstance, addItem, editItem, validationSchema, formFields }) => {
  const { selectedFlatRows, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;

  const [paymentImage, setPaymentImage] = useState([]);

  const onSubmit = (values) => {
    values.size += values.size_m;
    delete values.size_m;
    const formData = new FormData();
    const paymentSchema = {
      ...values,
    };

    if (paymentImage[0]?.dataurl.startsWith('data:')) {
      Object.entries(paymentSchema).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, value);
        }
      });
      formData.append('image', paymentImage[0].file);
    } else {
      Object.entries(paymentSchema).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    if (selectedFlatRows.length === 1) {
      editItem({ formData, payment_id: selectedFlatRows[0].original.payment_id });
    } else {
      addItem(formData);
    }
    setPaymentImage([]);
    setIsOpenAddEditModal(false);
  };

  const handleImageFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    setPaymentImage([{ file: new File([blob], filename, { type: blob.type }), dataurl: url }]);
  };

  useEffect(() => {
    if (selectedFlatRows.length === 1) {
      handleImageFromUrl(`${process.env.REACT_APP_BASE_API_URL}/${selectedFlatRows[0].values.image}`);
    } else {
      setPaymentImage([]);
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    if (!isOpenAddEditModal) {
      setPaymentImage([]);
    }
  }, [isOpenAddEditModal]);
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
  const options = [
    { value: 'ml', label: 'ml' },
    { value: 'L', label: 'L' },
    { value: 'Unidad', label: 'Unidad' },
  ];
  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Formik initialValues={selectedFlatRows.length === 1 ? selectedFlatRows[0].original : {}} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <Modal.Header>
            <Modal.Title>{selectedFlatRows.length === 1 ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col className="d-flex flex-column justify-content-between align-items-center mb-3">
              <PagosImageUploader initialImages={paymentImage} setImageState={setPaymentImage} />
            </Col>
            {formFields.map(({ id, label, type }) => (
              <div className="mb-3" key={id}>
                <label className="form-label">{label}</label>
                <Field className="form-control" type={type} id={id} name={id} />
                <ErrorMessage style={{ color: 'red' }} name={id} component="div" />
              </div>
            ))}

            <div className="mb-3" key="size">
              <label className="form-label">Tamaño</label>
              <Row>
                <Col sm="6">
                  <Field className="form-control" type="text" id="size" name="size" />
                </Col>
                <Col sm="6">
                  <Field className="form-control" id="size_m" name="size_m" component={CustomSelect} options={options} required />
                </Col>
              </Row>

              <ErrorMessage style={{ color: 'red' }} name="size" component="div" />
            </div>
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
      </Formik>
    </Modal>
  );
};
