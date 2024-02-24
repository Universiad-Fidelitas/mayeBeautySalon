import { baseApi } from 'api/apiConfig';
import { setStock, setLoadedStock, setLoadingStock } from './stockSlice';

const getStock = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingStock());
      const { data } = await baseApi.post('/stock', tableStatus);
      console.log('jose-thunk', data);
      if (data) {
        dispatch(setStock(data));
        dispatch(setLoadedStock());
      }
    } catch (error) {
      dispatch(setLoadedStock());
    }
  };
};

export { getStock };
