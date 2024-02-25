import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useProducts = () => {
  const getProduct = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/products', tableStatus);
    return data;
  };

  return useQuery(['project-products'], getProduct, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
