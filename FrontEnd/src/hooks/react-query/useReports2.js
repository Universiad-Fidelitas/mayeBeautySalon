import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useReports2 = () => {
  const getReport2 = async () => {
    const { data } = await baseApi.get('/reports/report2');
    return data;
  };

  return useQuery(['project-reports2'], getReport2, {
    refetchOnWindowFocus: false,
    onError: () => {
      // console.log('first')
    },
  });
};
