import { useField } from 'formik';
import DatePicker from 'react-datepicker';
import React from 'react'
import 'react-datepicker/dist/react-datepicker.css';

export const DatepickerField = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);

    const { setValue } = helpers;
  return (
    <div className="mb-3 top-label">
      <label htmlFor={props.id || props.name}>{label}</label>
      <DatePicker
        {...field}
        {...props}
        className="form-control" 
        selected={(field.value && new Date(field.value)) || null}
        onChange={(date) => setValue(date)}
        onBlur={() => field.onBlur(field.name)}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  )
}
