import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useServices = () => {
  const getService = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/services', tableStatus);
    return data;
  };

  return useQuery(['project-services'], getService, {
    refetchOnWindowFocus: false,
    onError: () => {},
  });
};
