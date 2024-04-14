import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedRols, setLoadingRols, setRols } from './rolsSlice';

const getRols = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingRols());
      const { data } = await baseApi.post('/roles', tableStatus);
      if (data) {
        dispatch(setRols(data));
        dispatch(setLoadedRols());
      }
    } catch (error) {
      dispatch(setLoadedRols());
    }
  };
};

const postRol = (newRol) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/roles/add', newRol);
      const { success, message } = data;
      if (success) {
        dispatch(getRols({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editRol = ({ role_id, name, permissions, activated }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/roles/${role_id}`, { name, permissions, activated });
      const { success, message } = data;
      if (success) {
        dispatch(getRols({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteRols = (rol_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/roles/delete', { role_id: rol_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getRols({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getRols, postRol, editRol, deleteRols };
