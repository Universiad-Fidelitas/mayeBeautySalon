import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useReports = () => {
  const getReport1 = async () => {
    const { data } = await baseApi.get('/reports/report1');
    return data;
  };

  return useQuery(['project-reports'], getReport1, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
