import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const usePayments = () => {
  const getPayment = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/payments', tableStatus);
    return data;
  };

  return useQuery(['project-payments'], getPayment, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
