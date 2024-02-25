import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedInventory, setLoadingInventory, setInventory } from './inventorySlice';

const getInventory = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingInventory());
      const { data } = await baseApi.post('/inventory', tableStatus);
      if (data) {
        dispatch(setInventory(data));
        dispatch(setLoadedInventory());
      }
    } catch (error) {
      dispatch(setLoadedInventory());
    }
  };
};

const postInventory = (newInventory) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/inventory/add', newInventory);
      const { success, message } = data;
      if (success) {
        dispatch(getInventory({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getInventory, postInventory };
