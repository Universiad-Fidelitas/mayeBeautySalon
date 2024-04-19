import React, { useCallback, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';

export const ControlsVisible = ({ tableInstance, checked, onChange }) => {
  const { formatMessage: f } = useIntl();
  console.log(tableInstance);
  const { setPageSize, gotoPage } = tableInstance;
  if (checked === true) {
    return (
      <>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-delete">Activado</Tooltip>}>
          <Button
            variant="outline-primary"
            className="btn-icon btn-icon-only shadow delete-datatable"
            onClick={() => {
              gotoPage(0);
              onChange(true);
              setPageSize(5);
            }}
          >
            <CsLineIcons icon="eye" />
          </Button>
        </OverlayTrigger>
      </>
    );
  }

  return (
    <>
      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-delete">Desactivado</Tooltip>}>
        <Button
          variant="outline-primary"
          className="btn-icon btn-icon-only shadow delete-datatable"
          onClick={() => {
            onChange(false);
            setPageSize(5);
            gotoPage(0);
          }}
        >
          <CsLineIcons icon="eye-off" />
        </Button>
      </OverlayTrigger>
    </>
  );
};
