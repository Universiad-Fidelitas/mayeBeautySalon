import { baseApi } from 'api/apiConfig';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

/* eslint-disable react-hooks/rules-of-hooks */
export const useServices = ({ term, pageIndex, pageSize, sortBy, term2 }) => {
  const { formatMessage: f } = useIntl();
  const getServices = async () => {
    const { data } = await baseApi.post('/services', {
      term,
      pageIndex,
      pageSize,
      sortBy,
      term2,
    });
    return data;
  };

  const addServices = () => {
    const queryClient = useQueryClient();

    const addServicesApi = useCallback(async (newService) => {
      const { data } = await baseApi.post('/services/add', newService);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(addServicesApi, {
      onMutate: async (newService) => {
        await queryClient.cancelQueries(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);
        const previousData = queryClient.getQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);

        queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }], (oldData) => {
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
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const updateServices = () => {
    const queryClient = useQueryClient();

    const updateServicesApi = useCallback(async (newService) => {
      const { data } = await baseApi.put(`/services/${newService.service_id}`, newService);
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(updateServicesApi, {
      onMutate: async (newService) => {
        await queryClient.cancelQueries(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);
        const previousData = queryClient.getQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);

        queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }], (oldData) => {
          const newItems = oldData.items.map((item) => {
            if (item.service_id === newService.service_id) {
              return newService;
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
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);
        if (!error && pageCount) {
          queryClient.setQueryData(['project-services', { term, pageIndex, pageSize, sortBy, term2 }], (oldData) => ({
            ...oldData,
            pageCount,
          }));
        }
      },
    });
  };

  const deleteServices = () => {
    const queryClient = useQueryClient();

    const deleteServicesApi = useCallback(async (services) => {
      const { data } = await baseApi.post('/services/delete', { service_ids: services });
      const { success, message } = data;
      if (success) {
        toast(f({ id: message }), { className: 'success' });
      } else {
        toast(f({ id: message }), { className: 'danger' });
      }
      return data;
    }, []);

    return useMutation(deleteServicesApi, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['project-services', { term, pageIndex, pageSize, sortBy, term2 }]);
      },
    });
  };

  return {
    getServices: useQuery(['project-services', { term, pageIndex, pageSize, sortBy, term2 }], getServices),
    addServices: addServices(),
    updateServices: updateServices(),
    deleteServices: deleteServices(),
  };
};

export const useGetAllServices = () => {
  const getAllServices = async () => {
    const { data } = await baseApi.get('/services/all');
    return data;
  };
  return useQuery(['client-services'], getAllServices);
};

/* eslint-enable react-hooks/rules-of-hooks */
