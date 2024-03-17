import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useReports3 = () => {
  const getReport3 = async () => {
    const { data } = await baseApi.get('/reports/report3');
    return data;
  };

  return useQuery(['project-reports3'], getReport3, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
