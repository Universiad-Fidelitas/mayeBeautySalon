import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useProviders = ({ term, pageIndex, pageSize, sortBy }) => {
  const { formatMessage: f } = useIntl();

  const getProviders = async () => {
    const { data } = await baseApi.post('/providers', {
      term,
      pageIndex,
      pageSize,
      sortBy,
    });
    return data;
  };

  const addProvider = () => {
    const queryClient = useQueryClient();

    const addProviderApi = useCallback(async (newProvider) => {
      const { data } = await baseApi.post('/providers/add', newProvider);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addProviderApi, {
      onMutate: async (newProvider) => {
        await queryClient.cancelQueries(['project-providers', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = [newProvider, ...oldData.items.slice(0, 4)];
          return {
            ...oldData,
            items: newItems,
            rowCount: newItems.length,
          };
        });

        return { previousData };
      },

      onSettled: async ({ pageCount }, error) => {
        await queryClient.invalidateQueries(['project-providers', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateProvider = () => {
    const queryClient = useQueryClient();

    const updateCategoryApi = useCallback(async ({ provider_id, name, phone, email }) => {
      const { data } = await baseApi.put(`/providers/${ provider_id }`, { name, phone, email });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateCategoryApi, {
      onMutate: async (providerUpdated) => {
        console.log('providerUpdated', providerUpdated)
        await queryClient.cancelQueries(['project-providers', { term, pageIndex, pageSize, sortBy }]);
        const previousData = queryClient.getQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }]);

        queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.category_id === providerUpdated.category_id) {
              return providerUpdated;
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

      onSettled: async (pageCount , error) => {
        await queryClient.invalidateQueries(['project-providers', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const inactivateProviders = () => {
    const queryClient = useQueryClient();
  
    const inactivateCategoriesApi = useCallback(
      async (providers) => {
        const { data } = await baseApi.post('/providers/delete', { provider_id: providers.toString() });
        const { success, message } = data;
        if (success) {
          toast(f({ id: message }), { className: 'success' });
        } else {
          toast(f({ id: message }), { className: 'danger' });
        }
        return data;
      },
      [f]
    );
  
    return useMutation(inactivateCategoriesApi, {
      onMutate: async (newProvider) => {
        queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => {
          console.log('oldDataMAUUU', oldData, newProvider)
          return {
            ...oldData,
            items: oldData.items.filter(({ category_id }) => !newProvider.includes(category_id)),
          };
        });
      },
      onSettled: async (pageCount , error) => {
        await queryClient.invalidateQueries(['project-providers', { term, pageIndex, pageSize, sortBy }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-providers', { term, pageIndex, pageSize, sortBy }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  return {
    getProviders: useQuery(['project-providers', { term, pageIndex, pageSize, sortBy }], getProviders),
    addProvider: addProvider(),
    updateProvider: updateProvider(),
    inactivateProviders: inactivateProviders(),
  };
};

/* eslint-enable react-hooks/rules-of-hooks */
