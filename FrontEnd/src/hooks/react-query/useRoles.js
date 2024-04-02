import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useRoles = () => {
  const getRols = async () => {
    const tableStatus = { term: '', sortBy: [], pageIndex: 0, pageSize: 100 };
    const { data } = await baseApi.post('/roles', tableStatus);
    return data;
  };

  return useQuery(['project-roles'], getRols, {
    refetchOnWindowFocus: false,
    onError: () => {},
  });
};
