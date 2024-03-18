import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedPayments, setLoadingPayments, setPayments } from './paymentsSlice';


const getPayments = (tableStatus) => {
    return async (dispatch) => {
      try {
        dispatch(setLoadingPayments());
        const { data } = await baseApi.post('/payments', tableStatus);
        if (data) {
          dispatch(setPayments(data));
          dispatch(setLoadedPayments());
        }
      } catch (error) {
        dispatch(setLoadedPayments());
      }
    };
  };
  const postPayment = (formData) => {
    return async (dispatch) => {
      try {
        const { data } = await baseApi.post('/payments/add', formData);
        const { success, message } = data;
        if (success) {
          dispatch(getPayments({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
          toast(message, { className: 'success' });
        } else {
          toast(message, { className: 'danger' });
        }
      } catch (error) {
        toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
      }
    };
  };
  const editPayment = ({ payment_id, formData }) => {
    return async (dispatch) => {
      try {
        const { data } = await baseApi.put(`/payments/${payment_id}`, formData);
        const { success, message } = data;
        if (success) {
          dispatch(getPayments({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
          toast(message, { className: 'success' });
        }
      } catch (error) {
        toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
      }
    };
  };
  const deletePayments = (payment_ids) => {
    return async (dispatch) => {
      try {
        const { data } = await baseApi.post('/payments/delete', { payment_id: payment_ids.toString() });
        const { success, message } = data;
        if (success) {
          dispatch(getPayments({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
          toast(message, { className: 'success' });
        }
      } catch (error) {
        toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
      }
    };
  };

  export { getPayments, postPayment, editPayment, deletePayments };