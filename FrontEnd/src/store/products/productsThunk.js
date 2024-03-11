import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedProducts, setLoadingProducts, setProducts } from './productsSlice';

const getProducts = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingProducts());
      const { data } = await baseApi.post('/products', tableStatus);
      if (data) {
        dispatch(setProducts(data));
        dispatch(setLoadedProducts());
      }
    } catch (error) {
      dispatch(setLoadedProducts());
    }
  };
};

const postProduct = (formData) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/products/add', formData);
      const { success, message } = data;
      if (success) {
        dispatch(getProducts({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editProduct = ({ product_id, formData }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/products/${product_id}`, formData);
      const { success, message } = data;
      if (success) {
        dispatch(getProducts({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteProducts = (product_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/products/delete', { product_id: product_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getProducts({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getProducts, postProduct, editProduct, deleteProducts };
