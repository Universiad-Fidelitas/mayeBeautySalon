import React from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useIntl } from 'react-intl';

const ControlsPageSize = ({ tableInstance }) => {
  const { formatMessage: f } = useIntl();
  const {
    setPageSize,
    gotoPage,
    state: { pageSize },
  } = tableInstance;
  const options = [5, 10, 20];

  const onSelectPageSize = (size) => {
    setPageSize(size);
    gotoPage(0);
  };

  return (
    <OverlayTrigger placement="top" delay={{ show: 1000, hide: 0 }} overlay={<Tooltip>Item Count</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <Dropdown className="d-inline-block" align="end">
          <Dropdown.Toggle ref={ref} {...triggerHandler} variant="foreground-alternate" className="shadow">
            {pageSize} {f({ id: 'menu.items' })}
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="shadow dropdown-menu-end"
            popperConfig={{
              modifiers: [
                {
                  name: 'computeStyles',
                  options: {
                    gpuAcceleration: true,
                  },
                },
              ],
            }}
          >
            {options.map((pSize) => (
              <Dropdown.Item key={`pageSize.${pSize}`} active={pSize === pageSize} onClick={() => onSelectPageSize(pSize)}>
                {pSize} {f({ id: 'menu.items' })}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </OverlayTrigger>
  );
};

export default ControlsPageSize;
