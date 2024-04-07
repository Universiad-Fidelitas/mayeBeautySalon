import React from 'react';
import ImageUploading from 'react-images-uploading';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import classNames from 'classnames';

export const UploaderComponent = ({ initialImages, isError, setFieldValue }) => {
  const onChange = (imageList) => {
    setFieldValue('voucher_path', imageList);
  };

  return (
    <>
      <ImageUploading value={initialImages} onChange={onChange} maxNumber={1} dataURLKey="dataurl">
        {({ imageList, onImageUpload, onImageUpdate }) => {
          return (
            <div className={classNames('user-dropzone rounded-circle', isError && 'is-invalid')}>
              {!imageList.length > 0 && (
                <div className="image-item h-100 w-100 d-flex justify-content-center align-items-center">
                  <CsLineIcons size={100} icon="image" />
                  <button type="button" className="update-image-user-btn border-0 rounded-circle" onClick={() => onImageUpload()}>
                    <CsLineIcons icon="upload" />
                  </button>
                </div>
              )}
              {imageList.map((image, index) => {
                const imagePreset =
                  image?.dataurl && image.dataurl.startsWith('data:') ? image.dataurl : [process.env.REACT_APP_BASE_API_URL, image.dataurl].join('/');

                return (
                  <div key={index} className="image-item h-100 w-100">
                    <img
                      src={imagePreset}
                      alt=""
                      className="rounded-circle"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://static.vecteezy.com/system/resources/thumbnails/002/745/930/small/sales-printed-receipt-icon-free-vector.jpg';
                      }}
                    />
                    <button type="button" className="update-image-user-btn border-0 rounded-circle" onClick={() => onImageUpdate(index)}>
                      <CsLineIcons icon="edit" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        }}
      </ImageUploading>
    </>
  );
};
