import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedExpenses, setLoadingExpenses, setExpenses } from './expensesSlice';

const getExpenses = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingExpenses());
      const { data } = await baseApi.post('/expenses', tableStatus);
      if (data) {
        dispatch(setExpenses(data));
        dispatch(setLoadedExpenses());
      }
    } catch (error) {
      dispatch(setLoadedExpenses());
    }
  };
};

const postExpense = (newExpense) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/expenses/add', newExpense);
      const { success, message } = data;
      if (success) {
        dispatch(getExpenses({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editExpense = ({ expense_id, expense_type, price }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/expenses/${expense_id}`, { expense_type, price });
      const { success, message } = data;
      if (success) {
        dispatch(getExpenses({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteExpenses = (expense_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/expenses/delete', { expense_id: expense_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getExpenses({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getExpenses, postExpense, editExpense, deleteExpenses };
