import React, { useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import { Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

export const UsuariosImageUploader = ({ initialImages, setImageState }) => {
  const onChange = (imageList, addUpdateIndex) => {
    setImageState(imageList);
  };

  return (
    <>
      <ImageUploading value={initialImages} onChange={onChange} maxNumber={1} dataURLKey="dataurl">
        {({ imageList, onImageUpload, onImageUpdate }) => (
          <div className="user-dropzone rounded-circle">
            {!imageList.length > 0 && (
              <div className="image-item h-100 w-100 d-flex justify-content-center align-items-center">
                <CsLineIcons size={100} icon="user" />
                <button type="button" className="update-image-user-btn border-0 rounded-circle" onClick={() => onImageUpload()}>
                  <CsLineIcons icon="upload" />
                </button>
              </div>
            )}
            {imageList.map((image, index) => (
              <div key={index} className="image-item h-100 w-100">
                <img
                  src={image.dataurl}
                  alt=""
                  className="rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg';
                  }}
                />
                <button type="button" className="update-image-user-btn border-0 rounded-circle" onClick={() => onImageUpdate(index)}>
                  <CsLineIcons icon="edit" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </>
  );
};
