import React, { useCallback, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';

export const ControlsDelete = ({ tableInstance, deleteItems, modalTitle, modalDescription }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows } = tableInstance;
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const onClick = useCallback(() => {
    setConfirmDeleteModal(true)
  }, []);

  const onConfirm = useCallback(() => {
    deleteItems(selectedFlatRows.map((x) => Object.entries(x.original).filter(([key]) => key.includes("id"))).flat().map(([key, value]) => value));
    setConfirmDeleteModal(false)
  }, [selectedFlatRows]);

  if (selectedFlatRows.length === 0) {
    return (
      <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow delete-datatable" disabled>
        <CsLineIcons icon="bin" />
      </Button>
    );
  }
  return (
    <>
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-delete">{f({ id: 'helper.delete' })}</Tooltip>}>
      <Button onClick={onClick} variant="foreground-alternate" className="btn-icon btn-icon-only shadow delete-datatable">
        <CsLineIcons icon="bin" />
      </Button>
    </OverlayTrigger>
     <Modal className="modal-close-out" show={confirmDeleteModal} onHide={() => setConfirmDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-body" onClick={() => setConfirmDeleteModal(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={() => onConfirm()}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};