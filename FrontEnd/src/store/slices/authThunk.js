import { baseApi } from 'api/apiConfig';
import { setCurrentUser } from './authSlice';

const loginUsuario = (loginData) => {
  return async (dispatch, getState) => {
    try {
        const { data } = await baseApi.post(
            `/auth/login`,
            loginData
        );
        if (data.isLogin) {
            dispatch(setCurrentUser(data))
            return data;
        }
        return data;
    } catch (error) {
        return error;
    }

  };
};

export {
    loginUsuario
};