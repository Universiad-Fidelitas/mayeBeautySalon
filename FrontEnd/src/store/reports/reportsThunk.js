import { baseApi } from 'api/apiConfig';
import { toast } from 'react-toastify';
import { setLoadedReports, setLoadingReports, setReports } from './reportsSlice';
import { setReports2, setLoadedReports2, setLoadingReports2 } from './reports2Slice';
import { setReports3, setLoadedReports3, setLoadingReports3 } from './reports3Slice';

const getReport1 = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingReports());
      const { data } = await baseApi.get('/reports/report1');
      console.log('karo', data);
      if (data) {
        dispatch(setReports(data));
        dispatch(setLoadedReports());
      }
    } catch (error) {
      dispatch(setLoadedReports());
    }
  };
};
const getReport2 = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingReports2());
      const { data } = await baseApi.get('/reports/report2');
      if (data) {
        dispatch(setReports2(data));
        dispatch(setLoadedReports2());
      }
    } catch (error) {
      dispatch(setLoadedReports2());
    }
  };
};
const getReport3 = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoadingReports3());
      const { data } = await baseApi.get('/reports/report3');
      if (data) {
        dispatch(setReports3(data));
        dispatch(setLoadedReports3());
      }
    } catch (error) {
      dispatch(setLoadedReports3());
    }
  };
};

export { getReport1, getReport2, getReport3 };
