import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useStock = () => {
  const getStock = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/stock', tableStatus);
    return data;
  };

  return useQuery(['project-stock'], getStock, {
    refetchOnWindowFocus: false,
    onError: () => {},
  });
};
