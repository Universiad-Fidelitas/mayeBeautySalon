import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useLogs = () => {
  const getLogs = async ({ term = '', sortBy = [], pageIndex = 0, pageSize = 100 }) => {
    const tableStatus = { term, sortBy, pageIndex, pageSize };
    const { data } = await baseApi.post('/logs', tableStatus);  
    return data;
  };

  return useQuery(['project-logs'], () => getLogs({}), {  
    refetchOnWindowFocus: false,
    onError: () => {
    
    },
  });
};
