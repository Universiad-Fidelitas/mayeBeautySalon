import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedCategories, setLoadingCategories, setCategories } from './categoriesSlice';

const getCategories = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingCategories());
      const { data } = await baseApi.post('/categories', tableStatus);
      if (data) {
        dispatch(setCategories(data));
        dispatch(setLoadedCategories());
      }
    } catch (error) {
      dispatch(setLoadedCategories());
    }
  };
};

const postCategory = (newCategory) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/categories/add', newCategory);
      const { success, message } = data;
      if (success) {
        dispatch(getCategories({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editCategory = ({ category_id, name }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/categories/${category_id}`, { name });
      const { success, message } = data;
      if (success) {
        dispatch(getCategories({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteCategories = (category_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/categories/delete', { category_id: category_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getCategories({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getCategories, postCategory, editCategory, deleteCategories };
