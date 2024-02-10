import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useCategories = () => {
  const getCategory = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/categories', tableStatus);
    return data;
  };

  return useQuery(['project-categories'], getCategory, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
