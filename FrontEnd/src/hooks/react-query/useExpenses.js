import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useExpenses = () => {
  const getExpense = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/expenses', tableStatus);
    return data;
  };

  return useQuery(['project-expenses'], getExpense, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
