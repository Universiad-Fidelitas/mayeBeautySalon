import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { MENU_PLACEMENT } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import { getNotifications } from '../../../store/notifications/notificationsThunk';

const NotificationsDropdownToggle = React.memo(
  React.forwardRef(({ onClick, expanded = false, notificationCount = 0 }, ref) => (
    <a
      ref={ref}
      href="#/"
      className="notification-button text-white"
      data-toggle="dropdown"
      aria-expanded={expanded}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
    >
      <div className="position-relative d-inline-flex me-3">
        <CsLineIcons icon="bell" size="25" />
        {notificationCount > 0 && <span className="position-absolute top-0 start-100 badge bg-primary rounded-pill translate-middle">{notificationCount}</span>}
      </div>
    </a>
  ))
);
const NotificationItem = ({ name = '', amount = '' }) => (
  <li className="mb-3 pb-3 border-bottom border-separator-light d-flex">
    <div className="align-self-center">
      <NavLink to="/inventariado/notifications" activeClassName="">
        <h5>El producto {name} está bajo de stock</h5>
        <p>La cantidad actual del producto es menor a {amount} </p>
      </NavLink>
    </div>
  </li>
);

const NotificationsDropdownMenu = React.memo(
  React.forwardRef(({ style, className, labeledBy, items }, ref) => {
    console.log('items', items);
    return (
      <div ref={ref} style={style} className={classNames('wide notification-dropdown scroll-out', className)} aria-labelledby={labeledBy}>
        <OverlayScrollbarsComponent
          options={{
            scrollbars: { autoHide: 'leave', autoHideDelay: 600 },
            overflowBehavior: { x: 'hidden', y: 'scroll' },
          }}
          className="scroll"
        >
          <ul className="list-unstyled border-last-none">
            {items.map((item, itemIndex) =>
              item.activated === 1 ? <NotificationItem key={`notificationItem.${itemIndex}`} name={item.name} amount={item.amount} /> : null
            )}
          </ul>
        </OverlayScrollbarsComponent>
      </div>
    );
  })
);
NotificationsDropdownMenu.displayName = 'NotificationsDropdownMenu';

const MENU_NAME = 'Notifications';
const Notifications = () => {
  const dispatch = useDispatch();

  const {
    placementStatus: { view: placement },
    behaviourStatus: { behaviourHtmlData },
    attrMobile,
    attrMenuAnimate,
  } = useSelector((state) => state.menu);
  const { color } = useSelector((state) => state.settings);
  const { notifications } = useSelector((state) => state.notifications);
  const { showingNavMenu } = useSelector((state) => state.layout);

  useEffect(() => {
    const tableStatus = { term: '', sortBy: [{ id: 'product_id', desc: false }], pageIndex: 0, pageSize: 5 };
    console.log('table', tableStatus);
    dispatch(getNotifications(tableStatus));
    return () => {};
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(layoutShowingNavMenu(''));
    // eslint-disable-next-line
  }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

  const onToggle = (status, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  };

  const notificationCount = Array.isArray(notifications) ? notifications.filter((notification) => notification.activated === 1).length : 0;

  if (notificationCount > 0) {
    return (
      <Dropdown
        as="li"
        bsPrefix="list-inline-item"
        onToggle={onToggle}
        show={showingNavMenu === MENU_NAME}
        align={placement === MENU_PLACEMENT.Horizontal ? 'end' : 'start'}
      >
        <Dropdown.Toggle as={NotificationsDropdownToggle} notificationCount={notificationCount} />
        <Dropdown.Menu
          as={NotificationsDropdownMenu}
          items={notifications}
          popperConfig={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: () => {
                    if (placement === MENU_PLACEMENT.Horizontal) {
                      return [0, 7];
                    }
                    if (window.innerWidth < 768) {
                      return [-168, 7];
                    }
                    return [-162, 7];
                  },
                },
              },
            ],
          }}
        />
      </Dropdown>
    );
  }
  return <></>;
};
export default React.memo(Notifications);
