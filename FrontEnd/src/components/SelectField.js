import { ErrorMessage, useField } from 'formik';
import React from 'react'
import Select from 'react-select';

export const SelectField = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
  
    const { setValue } = helpers;
  
    const handleChange = (selectedOption) => {
      setValue(selectedOption.value);
    };
  return (
    <div className="mb-3 top-label">
    <label htmlFor={props.id || props.name}>{label}</label>
    <Select
      {...field}
      {...props}
      classNamePrefix="react-select"
      onChange={handleChange}
      onBlur={() => field.onBlur(field.name)}
      value={props?.options?.find(option => option.value === field.value)}
    />
    {meta.touched && meta.error ? (
      <ErrorMessage className='text-danger' name={props.name} component="div" />
    ) : null}
  </div>
  )
}
