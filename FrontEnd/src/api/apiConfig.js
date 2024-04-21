import axios from 'axios';
import { setLogoutUser } from 'store/slices/authSlice';
import { toast } from 'react-toastify';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import jwtDecode from 'jwt-decode';
import { store } from '../store';

const baseApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to check token status
baseApi.interceptors.request.use(async (config) => {
  const { token, user_id } = store.getState().auth.currentUser;

  if (token) {
    const isTokenValid = jwtDecode(token).exp * 1000 >= new Date().getTime();

    if (isTokenValid) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.user_id = user_id;
    } else {
      const Content = () => (
        <>
          <div className="mb-2">
            <CsLineIcons icon="notification" width="20" height="20" className="cs-icon icon text-danger me-3 align-middle" />
            <span className="align-middle text-danger heading font-heading">El token expiró!</span>
          </div>
          <div className="text-muted mb-2">Haga login de nuevo</div>
        </>
      );

      toast(<Content />, { className: 'danger' });
      store.dispatch(setLogoutUser());
    }
  }

  return config;
});

export { baseApi };
