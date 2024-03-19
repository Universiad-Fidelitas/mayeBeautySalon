import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedServices, setLoadingServices, setServices } from './servicesSlice';

const getServices = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingServices());
      const { data } = await baseApi.post('/services', tableStatus);
      if (data) {
        dispatch(setServices(data));
        dispatch(setLoadedServices());
      }
    } catch (error) {
      dispatch(setLoadedServices());
    }
  };
};

const postService = (newService) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/services/add', newService);
      const { success, message } = data;
      if (success) {
        dispatch(getServices({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editService = ({ service_id, name, price, duration }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/services/${service_id}`, { name, price, duration });
      const { success, message } = data;
      if (success) {
        dispatch(getServices({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteServices = (service_ids) => {
  console.log('service_id', service_ids);
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/services/delete', { service_id: service_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getServices({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getServices, postService, editService, deleteServices };
