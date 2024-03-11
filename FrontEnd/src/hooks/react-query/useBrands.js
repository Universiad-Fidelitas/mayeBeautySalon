import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useBrands = () => {
  const getBrand = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/brands', tableStatus);
    return data;
  };

  return useQuery(['project-brands'], getBrand, {
    refetchOnWindowFocus: false,
    onError: () => {
    },
  });
};
