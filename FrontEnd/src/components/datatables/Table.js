/* eslint-disable no-plusplus */
import classNames from 'classnames';
import React from 'react';
import { useIntl } from 'react-intl';

export const Table = ({ tableInstance, className = 'react-table boxed' }) => {
  const { formatMessage: f } = useIntl();
  const { getTableProps, headerGroups, page, getTableBodyProps, prepareRow } = tableInstance;

  return (
    <>
      <table className={className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerIndex) => (
            <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    key={`th.${index}`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={classNames(column.headerClassName, {
                      sorting_desc: column.isSortedDesc,
                      sorting_asc: column.isSorted && !column.isSortedDesc,
                      sorting: column.sortable,
                    })}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <tr key={`tr.${i}`} {...row.getRowProps()} className={classNames({ selected: row.isSelected })}>
                {row.cells.map((cell, cellIndex) => {
                  if (cell.column.id === 'duration') {
                    const hours = cell.value.split('.')[0];
                    const minutes = cell.value.split('.')[1];
                    return (
                      <td key={`td.${cellIndex}`} {...cell.getCellProps()} onClick={() => row.toggleRowSelected()}>
                        <span>
                          {hours}h {minutes}m
                        </span>
                      </td>
                    );
                  }
                  if (cell.column.id === 'image') {
                    return (
                      <td key={`td.${cellIndex}`} {...cell.getCellProps()} onClick={() => row.toggleRowSelected()}>
                        <img
                          src={`${process.env.REACT_APP_BASE_API_URL}/${cell.value}`}
                          alt="image"
                          className="card-img card-img-horizontal sw-11 h-100 h-100 sh-lg-9 thumb"
                          id="contactThumb"
                        />
                      </td>
                    );
                  }
                  if (cell.column.id === 'price' || cell.column.id === 'price_buy') {
                    return (
                      <td key={`td.${cellIndex}`} {...cell.getCellProps()} onClick={() => row.toggleRowSelected()}>
                        {parseFloat(cell.value).toLocaleString('es-CR', {
                          style: 'currency',
                          currency: 'CRC',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    );
                  }
                  if (cell.column.id === 'activated') {
                    return (
                      <td key={`td.${cellIndex}`} {...cell.getCellProps()} onClick={() => row.toggleRowSelected()}>
                        {cell.value ? (
                          <span className="badge bg-outline-success">{f({ id: 'helper.activated' })}</span>
                        ) : (
                          <span className="badge bg-outline-danger">{f({ id: 'helper.inactivated' })}</span>
                        )}
                      </td>
                    );
                  }
                  return (
                    <td key={`td.${cellIndex}`} {...cell.getCellProps()} onClick={() => row.toggleRowSelected()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
