import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedNotifications, setLoadingNotifications, setNotifications } from './notificationsSlice';

const getNotifications = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingNotifications());
      const { data } = await baseApi.post('/notifications', tableStatus);
      if (data) {
        dispatch(setNotifications(data));
        dispatch(setLoadedNotifications());
      }
    } catch (error) {
      dispatch(setLoadedNotifications());
    }
  };
};

const postNotification = (newNotification) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/notifications/add', newNotification);
      const { success, message } = data;
      if (success) {
        dispatch(getNotifications({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editNotification = ({ notification_id, product_id, amount }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/notifications/${notification_id}`, { product_id, amount });
      const { success, message } = data;
      if (success) {
        dispatch(getNotifications({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteNotifications = (notification_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/notifications/delete', { notification_id: notification_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getNotifications({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getNotifications, postNotification, editNotification, deleteNotifications };
