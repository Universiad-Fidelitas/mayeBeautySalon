import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedLogs, setLoadingLogs, setLogs } from './logsSlice';

const getLogs = (tableStatus) => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingLogs());
      const { data } = await baseApi.post('/logs', tableStatus);
      if (data) {
        dispatch(setLogs(data));
        dispatch(setLoadedLogs());
      }
    } catch (error) {
      dispatch(setLoadedLogs());
    }
  };
};

const postLog = (newLog) => {
  return async (dispatch) => {
    try {
      const { data } = await baseApi.post('/logs/add', newLog);
      const { success, message } = data;
      if (success) {
        dispatch(getLogs({ term: '', sortBy: [], pageIndex: 0, pageSize: 5 }));
        toast(message, { className: 'success' });
      } else {
        toast(message, { className: 'danger' });
      }
    } catch (error) {
      toast('¡Se ha producido un error al ejecutar la acción.!', { className: 'danger' });
    }
  };
};





export { getLogs, postLog };
