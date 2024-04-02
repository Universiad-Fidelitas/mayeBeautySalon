import React from 'react';
import ImageUploading from 'react-images-uploading';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import classNames from 'classnames';

export const UploaderComponent = ({ initialImages, isError, setFieldValue }) => {
  const onChange = (imageList) => {
    setFieldValue('image', imageList);
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
                const imagePreset = image?.dataurl.startsWith('data:') ? image.dataurl : [process.env.REACT_APP_BASE_API_URL, image.dataurl].join('/');

                return (
                  <div key={index} className="image-item h-100 w-100">
                    <img
                      src={imagePreset}
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
                );
              })}
            </div>
          );
        }}
      </ImageUploading>
    </>
  );
};
