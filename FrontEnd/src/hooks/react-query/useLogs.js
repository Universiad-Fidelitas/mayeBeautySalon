import { baseApi } from 'api/apiConfig';
import {  useQuery } from 'react-query';

export const useActionLogs = () => {
  const getActionLogs = async () => {
    const { data } = await baseApi.get('/logs');
    return data;
  };
  return useQuery(['project-action-logs'], getActionLogs);
};

export const useErrorLogs = () => {
  const getErrorLogs = async () => {
    const { data } = await baseApi.get('/logs/errors');
    return data;
  };
  return useQuery(['project-error-logs'], getErrorLogs);
};
