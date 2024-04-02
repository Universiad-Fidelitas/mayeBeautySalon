import { baseApi } from 'api/apiConfig';
import { setCurrentUser } from './authSlice';

const loginUsuario = (loginData) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post(`/auth/login`, loginData);
      if (data.isLogin) {
        dispatch(setCurrentUser(data));
        return data;
      }
      return data;
    } catch (error) {
      return error;
    }
  };
};

const forgotPassword = (email) => {
  return async () => {
    try {
      const { data } = await baseApi.post('/auth/password-reset', { email });
      return data;
    } catch (error) {
      return error;
    }
  };
};

const updateUserPassword = (updatePassData) => {
  return async () => {
    try {
      const { data } = await baseApi.post('/auth/password-reset/update-password', updatePassData);
      return data;
    } catch (error) {
      return error;
    }
  };
};

export { loginUsuario, forgotPassword, updateUserPassword };
