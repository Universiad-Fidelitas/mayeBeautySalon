import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedProviders, setLoadingProviders, setProviders } from './providersSlice';

const getProviders = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingProviders());
      const { data } = await baseApi.post('/providers', tableStatus);
      if (data) {
        dispatch(setProviders(data));
        dispatch(setLoadedProviders());
      }
    } catch (error) {
      dispatch(setLoadedProviders());
    }
  };
};

const postProvider = (newProvider) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/providers/add', newProvider);
      const { success, message } = data;
      if (success) {
        dispatch(getProviders({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editProvider = ({ provider_id, name }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/providers/${provider_id}`, { name });
      const { success, message } = data;
      if (success) {
        dispatch(getProviders({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteProviders = (provider_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/providers/delete', { provider_id: provider_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getProviders({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getProviders, postProvider, editProvider, deleteProviders };
