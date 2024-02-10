import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useProviders = () => {
  const getProvider = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/providers', tableStatus);
    return data;
  };

  return useQuery(['project-providers'], getProvider, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
