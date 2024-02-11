import React from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';

const UserDropzonePreview = ({ meta, fileWithMeta }) => {
  const { remove } = fileWithMeta;
  const { name, status, previewUrl, size } = meta;

  return (
    <Row className="rounded-circle w-100 h-100 overflow-hidden">
      <img src={previewUrl} alt="preview image" className="p-0"/>
    </Row>
  );
};

export default UserDropzonePreview;
