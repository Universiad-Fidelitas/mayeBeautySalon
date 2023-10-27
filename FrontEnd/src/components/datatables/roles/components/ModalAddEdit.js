import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const ModalAddEdit = ({ tableInstance, addItem, editItem }) => {
  const { selectedFlatRows, data, setIsOpenAddEditModal, isOpenAddEditModal } = tableInstance;
  const emptyItem = { id: data.length + 1, name: '', sales: '', stock: '', category: '', tag: '' };
  const [selectedItem, setSelectedItem] = useState(emptyItem);

  useEffect(() => {
    if (isOpenAddEditModal && selectedFlatRows.length === 1) {
      setSelectedItem(selectedFlatRows[0].original);
    } else {
      setSelectedItem(emptyItem);
    }
    return () => {};
  }, [isOpenAddEditModal, selectedFlatRows]);

  const changeName = (event) => {
    setSelectedItem({ ...selectedItem, name: event.target.value });
  };

  const saveItem = () => {
    if (selectedFlatRows.length === 1) {
      editItem({ item: selectedItem });

      // const { index } = selectedFlatRows[0];
      // const newData = data.map((row, rowIndex) => (rowIndex === index ? selectedItem : row));
      // setData(newData);
    } else {
      addItem({ item: selectedItem });
    }
    setIsOpenAddEditModal(false);
  };

  return (
    <Modal className="modal-right" show={isOpenAddEditModal} onHide={() => setIsOpenAddEditModal(false)}>
      <Modal.Header>
        <Modal.Title>{selectedFlatRows.length === 1 ? 'Edit' : 'Add'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb-3">
            <Form.Label>Nombre del rol</Form.Label>
            <Form.Control type="text" defaultValue={selectedItem ? selectedItem.name : ''} onChange={changeName} />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => setIsOpenAddEditModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveItem}>
          {selectedFlatRows.length === 1 ? 'Done' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddEdit;
