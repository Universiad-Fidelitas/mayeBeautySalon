import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';

export const ControlsAdd = ({ tableInstance }) => {
  const { formatMessage: f } = useIntl();
  const { toggleAllPageRowsSelected, setIsOpenAddEditModal } = tableInstance;
  const addButtonClick = () => {
    toggleAllPageRowsSelected(false);
    setIsOpenAddEditModal(true);
  };

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-add">{f({ id: 'helper.add' })}</Tooltip>}>
      <Button onClick={addButtonClick} variant="foreground-alternate" className="btn-icon btn-icon-only shadow add-datatable">
        <CsLineIcons icon="plus" />
      </Button>
    </OverlayTrigger>
  );
};