import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';

export const ControlsEdit = ({ tableInstance }) => {
  const { formatMessage: f } = useIntl();
  const { selectedFlatRows, setIsOpenAddEditModal } = tableInstance;
  if (selectedFlatRows.length !== 1) {
    return (
      <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow edit-datatable" disabled>
        <CsLineIcons icon="edit" />
      </Button>
    );
  }
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-edit">{f({ id: 'helper.edit' })}</Tooltip>}>
      <Button onClick={() => setIsOpenAddEditModal(true)} variant="foreground-alternate" className="btn-icon btn-icon-only shadow edit-datatable">
        <CsLineIcons icon="edit" />
      </Button>
    </OverlayTrigger>
  );
};
