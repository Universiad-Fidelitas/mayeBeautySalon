import { baseApi } from 'api/apiConfig';
import { useQuery } from 'react-query';

export const useGetResetPassTokenState = (tokenLinkInformation) => {
  const getResetPassTokenState = async () => {
    const { data } = await baseApi.post('/auth/password-reset/token', tokenLinkInformation);
    return data;
  };

  return useQuery(['resetPassTokenState'], getResetPassTokenState, {
    refetchOnWindowFocus: false,
    onError: () => {},
  });
};
