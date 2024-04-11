import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos por defecto de react-datepicker
import { useIntl } from 'react-intl';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

export const ControlsDatePicker = ({ tableInstance, onChange }) => {
  const { formatMessage: f } = useIntl();
  const {
    state: { globalFilter },
  } = tableInstance;

  const [value, setValue] = React.useState(globalFilter);

  return (
    <>
      <div className="d-flex justify-content-evenly align-middle position-relative">
        <DatePicker
          selected={value || ''}
          onChange={(e) => {
            console.log(e);
            setValue(e);
            onChange(e);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText={f({ id: 'datepicker.placeholder' })}
          className="form-control datatable-search"
        />
        {value && (
          <span
            className="search-delete-icon position-absolute end-0 mt-1 me-2"
            onClick={() => {
              setValue('');
              onChange('');
            }}
          >
            <CsLineIcons icon="close" />
          </span>
        )}
        {!value && (
          <span className="search-magnifier-icon position-absolute end-0 mt-1 me-2">
            <CsLineIcons icon="calendar" />
          </span>
        )}
      </div>
    </>
  );
};
