import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedBrands, setLoadingBrands, setBrands } from './brandsSlice';

const getBrands = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingBrands());
      const { data } = await baseApi.post('/brands', tableStatus);
      if (data) {
        dispatch(setBrands(data));
        dispatch(setLoadedBrands());
      }
    } catch (error) {
      dispatch(setLoadedBrands());
    }
  };
};

const postBrand = (newBrand) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/brands/add', newBrand);
      const { success, message } = data;
      if (success) {
        dispatch(getBrands({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const editBrand = ({ brand_id, name }) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.put(`/brands/${brand_id}`, { name });
      const { success, message } = data;
      if (success) {
        dispatch(getBrands({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

const deleteBrands = (brand_ids) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/brands/delete', { brand_id: brand_ids.toString() });
      const { success, message } = data;
      if (success) {
        dispatch(getBrands({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};

export { getBrands, postBrand, editBrand, deleteBrands };
