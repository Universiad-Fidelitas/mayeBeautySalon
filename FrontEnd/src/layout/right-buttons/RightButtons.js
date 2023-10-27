/* Theme Settings & Niches Buttons */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SettingsModal from './SettingsModal';

const RightButtons = () => {
  const [isShowSettingsModal, setIsShowSettingsModal] = useState(false);
  const { formatMessage: f } = useIntl();
  const showSettingsModal = () => {
    setIsShowSettingsModal(true);
  };
  const closeSettingsModal = () => {
    setIsShowSettingsModal(false);
    document.documentElement.click();
  };

  return (
    <>
      <div className="settings-buttons-container">
        <OverlayTrigger delay={{ show: 1000, hide: 0 }} overlay={<Tooltip>{f({ id: 'menu.settings' })}</Tooltip>} placement="left">
          <Button variant="primary" className="settings-button p-0" onClick={showSettingsModal}>
            <span>
              <CsLineIcons icon="paint-roller" className="position-relative" />
            </span>
          </Button>
        </OverlayTrigger>
      </div>
      <SettingsModal show={isShowSettingsModal} handleClose={closeSettingsModal} />
    </>
  );
};
export default RightButtons;
