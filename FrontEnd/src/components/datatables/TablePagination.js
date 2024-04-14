/* eslint-disable no-plusplus */
import React from 'react';
import { Pagination } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

export const TablePagination = ({ tableInstance }) => {
  const {
    gotoPage,
    canPreviousPage,
    pageCount,
    previousPage,
    nextPage,
    canNextPage,
    state: { pageIndex },
  } = tableInstance;

  if (pageCount <= 1) {
    return <></>;
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 4;
    const middleIndex = Math.floor(maxVisible / 2);
    let startPage = Math.max(0, pageIndex - middleIndex);
    const endPage = Math.min(pageCount - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    if (endPage === pageCount - 1 && pageCount > maxVisible) {
      startPage = pageCount - maxVisible;
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item key={`pagination${i}`} className="shadow" active={pageIndex === i} onClick={() => gotoPage(i)}>
          {i + 1}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>
        <Pagination.First className="shadow" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <CsLineIcons icon="arrow-double-left" />
        </Pagination.First>
        <Pagination.Prev className="shadow" disabled={!canPreviousPage} onClick={() => previousPage()}>
          <CsLineIcons icon="chevron-left" />
        </Pagination.Prev>
        {renderPaginationItems()}
        <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={!canNextPage}>
          <CsLineIcons icon="chevron-right" />
        </Pagination.Next>
        <Pagination.Last className="shadow" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <CsLineIcons icon="arrow-double-right" />
        </Pagination.Last>
      </Pagination>
    </div>
  );
};
