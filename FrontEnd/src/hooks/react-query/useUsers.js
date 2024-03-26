import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useUsers = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getUsers = async () => {
    const { data } = await baseApi.post('/users', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addUser = () => {
    const queryClient = useQueryClient();

    const addUserApi = useCallback(async (newService) => {
      const { data } = await baseApi.post('/users/add', newService);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addUserApi, {
      onMutate: async (newService) => {
        await queryClient.cancelQueries(['project-users', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-users', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-users', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newService, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-users', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-users', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateUser = () => {
    const queryClient = useQueryClient();

    const updateUserApi = useCallback(async (userData) => {
      const { data } = await baseApi.put(`/users/${userData.get('user_id')}`, userData);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateUserApi, {
      onMutate: async (userData) => {
        await queryClient.cancelQueries(['project-users', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-users', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-users', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.user_id === userData.get('user_id')) {
              return userData;
            }
            return item;
          });
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-users', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-users', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  return {
    getUsers: useQuery(['project-users', { term, pageIndex, pageSize, sortBy }], getUsers),
    addUser: addUser(),
    updateUser: updateUser(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
