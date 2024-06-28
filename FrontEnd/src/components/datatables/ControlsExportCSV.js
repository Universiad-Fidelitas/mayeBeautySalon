import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';
import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

export const ControlsExportCSV = ({ tableInstance, type }) => {
  const { formatMessage: f } = useIntl();
  let headers2 = [];
  let data2 = [];

  if (tableInstance !== undefined && tableInstance.length > 0) {
    headers2 = Object.keys(tableInstance[0]);
    data2 = tableInstance;
  }

  const csvReport = {
    data: data2,
    headers: headers2,
    filename: `CSVReport${type}.csv`,
  };
  const addButtonClick = () => {};

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-add">Exportar a CSV</Tooltip>}>
      <CSVLink {...csvReport}>
        <Button onClick={addButtonClick} variant="foreground-alternate" className="btn-icon btn-icon-only shadow add-datatable">
          <CsLineIcons icon="download" />
        </Button>
      </CSVLink>
    </OverlayTrigger>
  );
};
