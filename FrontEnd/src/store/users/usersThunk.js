import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedUsers, setLoadingUsers, setUsers } from './usersSlice';

const getUsers = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingUsers());
      const { data } = await baseApi.post('/users', tableStatus);
      console.log("setLoadedUsers", data);
      if (data.items) {
        
        dispatch(setUsers(data));
        dispatch(setLoadedUsers());
      }
    } catch (error) {
      dispatch(setLoadedUsers());
    }
  };
};

const postUser = (newUser) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/users/add', newUser);
      const { success, message } = data;
      if (success) {
        dispatch(getUsers({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editUser = ({formData, userId}) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.patch(`/users/${userId}`, formData);
      const { success, message } = data;
      if (success) {
        dispatch(getUsers({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};


const deleteUsers = (user_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/users/delete', { user_id: user_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getUsers({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};
export { getUsers, postUser,editUser, deleteUsers };
