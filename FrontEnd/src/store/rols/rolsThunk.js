import { baseApi } from 'api/apiConfig';
import { setLoadedRols, setLoadingRols, setRols } from './rolsSlice';

const getRols = (tableStatus) => {
  return async (dispatch) => {
    try {
        dispatch(setLoadingRols())
        const { data } = await baseApi.post('/rols', tableStatus);
        if(data.items){
            dispatch(setRols(data))
            dispatch(setLoadedRols())
         }
    } catch (error) {
        dispatch(setLoadedRols())
    }
  };
};

const postRol = (newRol) => {
  return async (dispatch) => {
    try {
        const { data } = await baseApi.post('/rols/add', newRol);
        if(data){
            dispatch(getRols({ term: "", sortBy: [], pageIndex: 0, pageSize: 5 }))
         }
    } catch (error) {
        dispatch(setLoadedRols())
    }
  };
};

const editRol = ({ rol_id, name }) => {
  return async (dispatch) => {
    try {
        const { data } = await baseApi.put(`/rols/${rol_id}`, { name });
        if(data){
            dispatch(getRols({ term: "", sortBy: [], pageIndex: 0, pageSize: 5 }))
        }
    } catch (error) {
        dispatch(setLoadedRols())
    }
  };
};

export {
    getRols,
    postRol,
    editRol
};