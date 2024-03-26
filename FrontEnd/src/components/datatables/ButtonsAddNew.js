import { Button } from 'react-bootstrap';
import React from 'react';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useIntl } from 'react-intl';

export const ButtonsAddNew = ({ tableInstance }) => {
  const { toggleAllPageRowsSelected, setIsOpenAddEditModal } = tableInstance;
  const { formatMessage: f } = useIntl();

  const addButtonClick = () => {
    toggleAllPageRowsSelected(false);
    setIsOpenAddEditModal(true);
  };
  return (
    <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto add-datatable" onClick={addButtonClick}>
      <CsLineIcons icon="plus" /> <span>{f({ id: 'menu.addNew' })}</span>
    </Button>
  );
};
