import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { setLogoutUser } from 'store/slices/authSlice';
import Notifications from './notifications/Notifications';

export const NavUserMenu = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);
  const { formatMessage: f } = useIntl();

  if (!isLogin) {
    return (
      <div className="user-container d-flex">
        <Link to="/login">
          <Button variant="outline-white" className="btn-icon btn-icon-start sendPasswordButton">
            <span> {f({ id: 'helper.login' })}</span>
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="user-container d-flex">
      <Notifications/>
      <Button variant="outline-white" onClick={() => dispatch(setLogoutUser())} className="btn-icon btn-icon-start sendPasswordButton">
        <CsLineIcons icon="logout" />
        <span> {f({ id: 'helper.signOut' })}</span>
      </Button>
    </div>
  );
};
